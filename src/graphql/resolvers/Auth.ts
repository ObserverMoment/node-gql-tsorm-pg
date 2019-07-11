import {getRepository} from 'typeorm'
import {AuthenticationError} from 'apollo-server'
import scrypt from 'scrypt'
import User from '../../entity/roles/User'
import Role from '../../entity/roles/Role'

import {generateAccessToken} from '../../auth/tokens'
import {loginSingleFactor, enrolTwoFactor, loginTwoFactor} from '../../dataLogic/auth'

export const resolvers = {
  Query: {
    async me (root, args, {userId}, info) {
      const user = await getRepository(User).findOne(userId)
      if (!user) {
        throw new AuthenticationError(`Could not find a user with id: ${userId}.`)
      }
      return user
    },
    async loginSingleFactor (root, {email, password}, context, info) {
      const token = await loginSingleFactor(email, password)
      return token
    },
    async loginTwoFactor (root, {code}, {userId, tokenInfo}, info) {
      const {level, type} = tokenInfo
      if (level === 2 && type === 'grant') {
        const token = await loginTwoFactor(userId, code)
        return token
      } else {
        throw new AuthenticationError('You are not authorised to access Two Factor Login, please go through password authentication first.')
      }
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
      await roleRepo.save(newRole)

      const token = await generateAccessToken(savedUser.id, 1, 'access')
      return token
    },
    async enrolTwoFactor (root, {password}, {userId}, info) {
      const tokenAndDataURL = await enrolTwoFactor(userId, password)
      return tokenAndDataURL
    }
  }
}
