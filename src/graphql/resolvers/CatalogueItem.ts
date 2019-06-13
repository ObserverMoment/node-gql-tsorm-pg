import { getRepository } from 'typeorm'
import CatalogueItem from '../../entity/CatalogueItem'

export const resolvers = {
  Query: {
    async catalogueItem (root, { id }, context, info) {
      const catalogueItem = await getRepository(CatalogueItem).findOne(id)
      return catalogueItem
    },
    async catalogueItems (root, args, context, info) {
      const catalogueItems = await getRepository(CatalogueItem).find()
      return catalogueItems
    }
  },
  Mutation: {
    async createCatalogueItem (root, { input }, context, info) {
      const catalogueItem = await getRepository(CatalogueItem).create({ ...input })
      return catalogueItem
    },
    async updateCatalogueItem (root, { id, input }, context, info) {
      const catalogueItem = await getRepository(CatalogueItem).update(id, { ...input })
      return catalogueItem
    },
    async deleteCatalogueItem (root, { id }, context, info) {
      await getRepository(CatalogueItem).delete(id)
      return true
    }
  },
  CatalogueItem: {
    async organisation (catalogueItem, { input }, context, info) {
      return (await getRepository(CatalogueItem)
        .findOne(catalogueItem.id, { relations: ['orgnisation'] })).organisation
    }
  }
}
