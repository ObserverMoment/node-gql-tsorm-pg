import {getRepository} from 'typeorm'
import {AuthenticationError} from 'apollo-server'
import scrypt from 'scrypt'

import User from '../../entity/roles/User'
import Role from '../../entity/roles/Role'

import {generateAccessToken} from '../../auth/tokens'

export const resolvers = {
  Query: {
    async me (root, args, {user, scopes}, info) {
      return user
    },
    async loginStandard (root, {email, password}, context, info) {
      const user = loginStandard(email, password)
      const token = await generateAccessToken(user.id, 1)
      return {user, token}
    },
    async loginTwoFactor (root, {email, password, totpCode}, context, info) {
      const user = loginTwoFactor(email, password, totpCode)

      if (!user) {
        throw new AuthenticationError('There is no account associated with that email address')
      }

      const accountLocked = user.accountLocked === 1

      if (accountLocked) {
        throw new AuthenticationError('Sorry, this account has been locked due to security reasons. Please contact customer support.')
      }

      const passwordValid = scrypt.verifyKdfSync(Buffer.from(user.password, 'base64'), password)

      if (!passwordValid) {
        throw new AuthenticationError('The password entered was not correct')
      }

      const twoFactorEnabled = user.twoFactorEnabled === 1

      if (!twoFactorEnabled) {
        throw new AuthenticationError('You have not enabled two factor authentication on your account')
      }

      const totpCodeValid = false // TODO.

      if (!totpCodeValid) {
        throw new AuthenticationError('The access code entered was not correct')
      }

      const token = await generateAccessToken(user.id, 2)
      delete user.password // We don't want to serialize the password!!
      return {user, token}
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
        token: savedUser && savedRole && await generateAccessToken(savedUser.id, 1)
      }
    },
    async enableTwoFactor (root, {email, password}, context, info) {
      const user = await getRepository(User)
        .createQueryBuilder('user')
        .where('user.email = :email', {email})
        .addSelect('user.password')
        .addSelect('user.accountLocked')
        .getOne()

      if (!user) {
        throw new AuthenticationError('There is no account associated with that email address')
      }

      const passwordValid = scrypt.verifyKdfSync(Buffer.from(user.password, 'base64'), password)
      const twoFactorEnabled = user.twoFactorEnabled === 1

      if (!passwordValid) {
        throw new AuthenticationError('The password entered was not correct')
      }

      if (!twoFactorEnabled) {
        throw new AuthenticationError('You have not enabled two factor authentication on your account')
      }
      return true
    }
  }
}
