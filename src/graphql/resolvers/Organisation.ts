import { getRepository } from 'typeorm'
import Organisation from '../../entity/Organisation'

export const resolvers = {
  Query: {
    async organisation (root, { id }, context, info) {
      return await getRepository(Organisation).findOne(id)
    }
  },
  Mutation: {
    async createOrganisation (root, { input }, context, info) {
      return await getRepository(Organisation).create({ ...input })
    },
    async updateOrganisation (root, { id, input }, context, info) {
      return await getRepository(Organisation).update(id, { ...input })
    },
    async deleteOrganisation (root, { id }, context, info) {
      await getRepository(Organisation).delete(id)
      return true
    }
  },
  Organisation: {
    async users (organisation, { input }, context, info) {
      return (await getRepository(Organisation)
                    .findOne(organisation.id, { relations: ['users'] })).users
    },
    async catalogueItems (organisation, { input }, context, info) {
      return (await getRepository(Organisation)
                    .findOne(organisation.id, { relations: ['catalogueItems'] })).catalogueItems
    }
  }
}
