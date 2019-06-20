import { getRepository } from 'typeorm'
import { ApolloError } from 'apollo-server'
import CatalogueItem from '../../entity/catalogue/CatalogueItem'
import Organisation from '../../entity/Organisation'

export const resolvers = {
  Query: {
    async catalogueItem (root, { id }, context, info) {
      try {
        const catalogueItem = await getRepository(CatalogueItem).findOne(id)
        return catalogueItem
      } catch (err) {
        throw new ApolloError(err)
      }
    },
    async catalogueItems (root, args, context, info) {
      try {
        const catalogueItems = await getRepository(CatalogueItem).find()
        return catalogueItems
      } catch (err) {
        throw new ApolloError(err)
      }
    }
  },
  Mutation: {
    async createCatalogueItem (root, { input }, context, info) {
      try {
        const catalogueItem = await getRepository(CatalogueItem).create({ ...input })
        return catalogueItem
      } catch (err) {
        throw new ApolloError(err)
      }
    },
    async updateCatalogueItem (root, { id, input }, context, info) {
      try {
        const catalogueItem = await getRepository(CatalogueItem).update(id, { ...input })
        return catalogueItem
      } catch (err) {
        throw new ApolloError(err)
      }
    },
    async deleteCatalogueItem (root, { id }, context, info) {
      try {
        await getRepository(CatalogueItem).delete(id)
        return true
      } catch (err) {
        throw new ApolloError(err)
      }
    }
  },
  CatalogueItem: {
    async organisation (catalogueItem, { input }, context, info) {
      try {
        const orgRepo = getRepository(Organisation)
        const organisation = await orgRepo.findOne(catalogueItem.organisationId)
        return organisation
      } catch (err) {
        throw new ApolloError(err)
      }
    }
  }
}
