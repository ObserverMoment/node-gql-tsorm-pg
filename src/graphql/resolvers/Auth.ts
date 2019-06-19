import { getRepository, getConnection } from 'typeorm'
import { AuthenticationError } from 'apollo-server'
import scrypt from 'scrypt'

import User from '../../entity/roles/User'
import Role from '../../entity/roles/Role'

import { generateAccessToken } from '../../auth/tokens'

export const resolvers = {
  Query: {
    async me (root, args, { user }, info) {
      return user && user
    },
    async login (root, { email, password }, { res }, info) {
      const user = await getRepository(User).findOne({ where: { email } })
      if (!user) {
        throw new AuthenticationError('There is no account associated with that email address')
      }
      if (scrypt.verifyKdfSync(Buffer.from(user.password, 'base64'), password)) {
        const token = await generateAccessToken(user.id)
        return { user, token }
      } else {
        throw new AuthenticationError('The password entered was not correct')
      }
    }
  },
  Mutation: {
    async registerNewUser (root, { input }, context, info) {
      const { roleTypeId, organisationId, password } = input
      // TODO: Check that all the inputs are valid.
      // Otherwise throw a UserInputError
      try {
        const scryptParams = await scrypt.params(0.1)
        const passwordHash = (await scrypt.kdf(Buffer.from(password), scryptParams)).toString('base64')
        const inputWithHash = { ...input, password: passwordHash }
        const userRepo = getRepository(User)
        // .create() assumes input of an array like object by default - need to cast to single User.
        const newUser = userRepo.create(inputWithHash as User)
        const savedUser = await userRepo.save(newUser)

        // Relation: Create the role.
        const roleRepo = getRepository(Role)
        const newRole = roleRepo.create({ userId: savedUser.id, roleTypeId, organisationId })
        const savedRole = await roleRepo.save(newRole)

        return {
          user: savedUser,
          token: savedUser && savedRole && await generateAccessToken(savedUser.id)
        }
      } catch (err) {
        console.log('Error creating new user', err)
        throw new AuthenticationError(err)
      }
    }
  }
}
