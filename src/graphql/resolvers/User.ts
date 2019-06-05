import { getRepository } from 'typeorm'
import User from '../../entity/User'

const getRepo = () => getRepository(User)

export const resolvers = {
  Query: {
    async user (parent, { id }, context, info) {
      return await getRepo().findOne(id)
    },
    async users (parent, args, context, info) {
      return await getRepo().find()
    }
  },
  Mutation: {
    async createUser (parent, { input }, context, info) {
      return await getRepo().create({ ...input })
    },
    async updateUser (parent, { id, input }, context, info) {
      return await getRepo().update(id, { ...input })
    }
  }
}
