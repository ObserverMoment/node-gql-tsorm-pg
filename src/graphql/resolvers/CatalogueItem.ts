import { getRepository } from 'typeorm'
import CatalogueItem from '../../entity/CatalogueItem'

const getRepo = () => getRepository(CatalogueItem)

export const resolvers = {
  Query: {
    async catalogueItem (parent, { id }, context, info) {
      return await getRepo().findOne(id)
    },
    async catalogueItems (parent, args, context, info) {
      return await getRepo().find()
    }
  },
  Mutation: {
    async createCatalogueItem (parent, { input }, context, info) {
      return await getRepo().create({ ...input })
    },
    async updateCatalogueItem (parent, { id, input }, context, info) {
      return await getRepo().update(id, { ...input })
    },
    async deleteCatalogueItem (parent, { id }, context, info) {
      return await getRepo().delete(id)
    }
  }
}
