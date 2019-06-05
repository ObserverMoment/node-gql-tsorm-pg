import { getRepository } from 'typeorm'
import Organisation from '../../entity/Organisation'

const getRepo = () => getRepository(Organisation)

export const resolvers = {
  Query: {
    async organisation (parent, { id }, context, info) {
      return await getRepo().findOne(id)
    }
  },
  Mutation: {
    async createOrganisation (parent, { input }, context, info) {
      return await getRepo().create({ ...input })
    },
    async updateOrganisation (parent, { id, input }, context, info) {
      return await getRepo().update(id, { ...input })
    },
    async deleteOrganisation (parent, { id }, context, info) {
      await getRepo().delete(id)
      return true
    }
  }
}
