import {getRepository} from 'typeorm'
import scrypt from 'scrypt'
import otplib from 'otplib'
import crypto from 'crypto'
import qr from 'qrcode'
import User from '../../entity/roles/User'
import Role from '../../entity/roles/Role'

import {generateAccessToken} from '../../auth/tokens'
import {loginSingleFactor} from '../../dataLogic/auth'

export const resolvers = {
  Query: {
    async me (root, args, {userId}, info) {
      const user = getRepository(User).findOne(userId)
      return user
    },
    async loginSingleFactor (root, {email, password}, context, info) {
      const token = await loginSingleFactor(email, password)
      return token
    },
    async loginTwoFactor (root, {code}, context, info) {
      return true
    }
  },
  Mutation: {
    async registerNewUser (root, {input}, context, info) {
      const {roleTypeId, organisationId, password} = input
      // TODO: Check that all the inputs are valid.
      // Otherwise throw a UserInputError
      const scryptParams = await scrypt.params(0.1)
      const passwordHash = (await scrypt.kdf(Buffer.from(password), scryptParams)).toString('base64')
      const inputWithHash = {...input, password: passwordHash}
      const userRepo = getRepository(User)
      // .create() assumes input of an array like object by default - need to cast to single User.
      const newUser = userRepo.create(inputWithHash as User)
      const savedUser = await userRepo.save(newUser)

      // Relation: Create the role.
      const roleRepo = getRepository(Role)
      const newRole = roleRepo.create({userId: savedUser.id, roleTypeId, organisationId})
      const savedRole = await roleRepo.save(newRole)

      return {
        user: savedUser,
        token: savedUser && savedRole && await generateAccessToken(savedUser.id, 1, 'access')
      }
    },
    async enrolTwoFactor (root, {password}, {userId}, info) {
      const userRepo = getRepository(User)
      const user = await userRepo.findOne(userId)

      // Generate secret.
      const secret = otplib.authenticator.generateSecret() // base 32 encoded hex secret key.

      // Encrypt it and save to user.otpk as 'iv.encrypted'
      const iv = crypto.randomBytes(16)
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.CRYPT_SECRET_2FA), iv)
      const encryptedKey = cipher.update(secret)
      const updateUser = {
        ...user,
        twoFactorEnabled: true,
        otpk: `${iv}.${encryptedKey}`
      }
      const savedUser = await userRepo.save(updateUser)
      const otpauth = otplib.authenticator.keyuri(savedUser.email, 'Procure.it', secret) // user, service, secret to pass to auth app.
      qr.toDataURL(otpauth, (err, imageUrl) => {
        if (err) {
          throw Error('There was an issue creating your QR code')
        }
        return imageUrl
      })
    }
  }
}
