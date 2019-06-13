import { getRepository } from 'typeorm'
import Organisation from '../../entity/Organisation'

export const resolvers = {
  Query: {
    async organisation (root, { id }, context, info) {
      const organisation = await getRepository(Organisation).findOne(id)
      return organisation
    }
  },
  Mutation: {
    async createOrganisation (root, { input }, context, info) {
      const organisation = await getRepository(Organisation).create({ ...input })
      return organisation
    },
    async updateOrganisation (root, { id, input }, context, info) {
      const organisation = await getRepository(Organisation).update(id, { ...input })
      return organisation
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
