import { getRepository } from 'typeorm'
import { getConnection } from 'typeorm'
import User from '../../entity/User'

export const resolvers = {
  Query: {
    async user (parent, { id }, context, info) {
      return await getRepository(User).findOne(id)
    },
    async users (parent, args, context, info) {
      return await getRepository(User).find()
    }
  },
  Mutation: {
    async createUser (parent, { input }, context, info) {
      const userRepo = getRepository(User)
      const newUser = userRepo.create(input as User) // .create() assumes input of an array like object by default - need to cast to single User.
      const savedUser = await userRepo.save(newUser)
      // Relation: Assign to an organisation.
      await getConnection().createQueryBuilder()
            .relation(User, 'organisation')
            .of(savedUser.id)
            .set(input.organisationId)
      return savedUser
    },
    async updateUser (parent, { id, input }, context, info) {
      return await getRepository(User).update(id, { ...input })
    }
  },
  User: {
    async organisation (user, { input }, context, info) {
      return (await getRepository(User).findOne(user.id, { relations: ['organisation']})).organisation
    }
  }
}
