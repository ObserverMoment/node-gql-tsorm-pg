import { getRepository, getConnection } from 'typeorm'
import { AuthenticationError } from 'apollo-server'
import scrypt from 'scrypt'

import User from '../../entity/User'

export const resolvers = {
  Query: {
    async me (root, { userId }, context, info) {
      const user = await getRepository(User).findOne(userId)
      return user
    },
    async login (root, { email, password }, context, info) {
      try {
        const user = await getRepository(User).findOne({ where: email })
        if (scrypt.verifyKdfSync(Buffer.from(user.password), password)) {
          return user
        } else {
          throw new AuthenticationError('The password entered was not correct')
        }
      } catch (err) {
        console.log(err, 'Error logging in')
        throw new AuthenticationError(err)
      }
    },
    async user (root, { id }, context, info) {
      const user = await getRepository(User).findOne(id)
      return user
    },
    async users (root, args, context, info) {
      const users = await getRepository(User).find()
      return users
    }
  },
  Mutation: {
    async createUser (root, { input }, context, info) {
      console.log(input, context)
      const scryptParams = await scrypt.params(0.1)
      const passwordHash = (await scrypt.kdf(Buffer.from(input.password), scryptParams)).toString('base64')
      console.log('passwordHash', passwordHash)
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
      return savedUser
    },
    async updateUser (root, { id, input }, context, info) {
      const user = await getRepository(User).update(id, { ...input })
      return user
    }
  },
  User: {
    async organisation (user, { input }, context, info) {
      return (await getRepository(User)
        .findOne(user.id, { relations: ['organisation'] })).organisation
    }
  }
}
