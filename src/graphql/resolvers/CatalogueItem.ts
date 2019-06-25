import { getRepository } from 'typeorm'
import { ApolloError, AuthenticationError } from 'apollo-server'
import CatalogueItem from '../../entity/catalogue/CatalogueItem'
import Organisation from '../../entity/Organisation'
import { createEntity, updateEntity, deleteEntity } from '../../dataLogic/mutations'

export const resolvers = {
  Query: {
    async catalogueItem (root, { id }, context, info) {
      const inScopeOrgs = Object.keys(context.scopes)
      const catalogueItem = await getRepository(CatalogueItem).findOne(id)
      if (!inScopeOrgs.includes(catalogueItem.organisationId.toString())) {
        throw new AuthenticationError('You do not have access to data from this organisation')
      }
      return catalogueItem
    },
    async catalogueItems (root, organisationId, context, info) {
      const inScopeOrgs = Object.keys(context.scopes)
      if (!inScopeOrgs.includes(organisationId)) {
        throw new AuthenticationError('You do not have access to data from this organisation')
      }
      const catalogueItems = await getRepository(CatalogueItem).find({
        organisationId
      })
      return catalogueItems
    }
  },
  Mutation: {
    async createCatalogueItem (root, { input }, context, info) {
      const { organisationId } = input
      return createEntity(CatalogueItem, Organisation, organisationId, input, context)
    },
    async updateCatalogueItem (root, { id, input }, context, info) {
      return updateEntity(CatalogueItem, id, input, context)
    },
    async deleteCatalogueItem (root, { id }, context, info) {
      return deleteEntity(CatalogueItem, id, context)
    }
  }
}
