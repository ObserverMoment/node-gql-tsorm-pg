import { getRepository } from 'typeorm'
import CatalogueItem from '../../entity/CatalogueItem'

export const resolvers = {
  Query: {
    async catalogueItem (root, { id }, context, info) {
      return await getRepository(CatalogueItem).findOne(id)
    },
    async catalogueItems (root, args, context, info) {
      return await getRepository(CatalogueItem).find()
    }
  },
  Mutation: {
    async createCatalogueItem (root, { input }, context, info) {
      return await getRepository(CatalogueItem).create({ ...input })
    },
    async updateCatalogueItem (root, { id, input }, context, info) {
      return await getRepository(CatalogueItem).update(id, { ...input })
    },
    async deleteCatalogueItem (root, { id }, context, info) {
      return await getRepository(CatalogueItem).delete(id)
    }
  },
  CatalogueItem: {
    async organisation (catalogueItem, { input }, context, info) {
      return (await getRepository(CatalogueItem)
                    .findOne(catalogueItem.id, { relations: ['orgnisation'] })).organisation
    }
  }
}
