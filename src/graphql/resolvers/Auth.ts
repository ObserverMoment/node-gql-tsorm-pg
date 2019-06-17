import { getRepository, getConnection } from 'typeorm'
import { AuthenticationError } from 'apollo-server'
import scrypt from 'scrypt'

import User from '../../entity/User'

import { generateAccessToken } from '../../auth/tokens'

export const resolvers = {
  Query: {
    async me (root, { userId }, context, info) {
      try {
        const user = await getRepository(User).findOne(userId)
        return user
      } catch (err) {
        throw new AuthenticationError(err)
      }
    },
    async login (root, { email, password }, { res }, info) {
      try {
        const user = await getRepository(User).findOne({ where: { email } })
        if (!user) {
          throw new AuthenticationError('There is no account associated with that email address')
        }
        if (scrypt.verifyKdfSync(Buffer.from(user.password, 'base64'), password)) {
          const accessToken = await generateAccessToken(user.id)
          return accessToken
        } else {
          throw new AuthenticationError('The password entered was not correct')
        }
      } catch (err) {
        console.log(err, 'Error logging in')
        throw new AuthenticationError(err)
      }
    }
  },
  Mutation: {
    async registerNewUser (root, { input }, context, info) {
      // TODO: Check that all the inputs are valid.
      // Otherwise throw a UserInputError
      try {
        const scryptParams = await scrypt.params(0.1)
        const passwordHash = (await scrypt.kdf(Buffer.from(input.password), scryptParams)).toString('base64')
        const inputWithHash = { ...input, password: passwordHash }
        const userRepo = getRepository(User)
        // .create() assumes input of an array like object by default - need to cast to single User.
        const newUser = userRepo.create(inputWithHash as User)
        const savedUser = await userRepo.save(newUser)
        // Relation: Assign to an organisation.
        await getConnection().createQueryBuilder()
          .relation(User, 'organisation')
          .of(savedUser.id)
          .set(input.organisationId)
        const accessToken = generateAccessToken(savedUser.id)
        return { user: savedUser, accessToken }
      } catch (err) {
        console.log('Error creating new user', err)
        throw new AuthenticationError(err)
      }
    }
  }
}
