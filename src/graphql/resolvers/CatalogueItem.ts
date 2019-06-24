import { getRepository } from 'typeorm'
import { ApolloError, AuthenticationError } from 'apollo-server'
import CatalogueItem from '../../entity/catalogue/CatalogueItem'

export const resolvers = {
  Query: {
    async catalogueItem (root, { id }, context, info) {
      try {
        const inScopeOrgs = Object.keys(context.scopes)
        const catalogueItem = await getRepository(CatalogueItem).findOne(id)
        if (!inScopeOrgs.includes(catalogueItem.organisationId.toString())) {
          throw new AuthenticationError('You do not have access to data from this organisation')
        }
        return catalogueItem
      } catch (err) {
        console.log(err)
      }
    },
    async catalogueItems (root, organisationId, context, info) {
      try {
        const inScopeOrgs = Object.keys(context.scopes)
        if (!inScopeOrgs.includes(organisationId)) {
          throw new AuthenticationError('You do not have access to data from this organisation')
        }
        const catalogueItems = await getRepository(CatalogueItem).find({
          organisationId
        })
        return catalogueItems
      } catch (err) {
        console.log(err)
      }
    }
  },
  Mutation: {
    async createCatalogueItem (root, { input }, context, info) {
      const { organisationId } = input
      try {
        const inScopeOrgs = Object.keys(context.scopes)
        if (!inScopeOrgs.includes(organisationId.toString())) {
          throw new AuthenticationError('You do not have access to data from this organisation')
        }
        const catalogueItem = await getRepository(CatalogueItem).create({ ...input })
        return catalogueItem
      } catch (err) {
        console.log(err)
      }
    },
    async updateCatalogueItem (root, { id, input }, context, info) {
      try {
        const inScopeOrgs = Object.keys(context.scopes)
        const organisationId = await getRepository(CatalogueItem).find({
          where: { id },
          select: [ 'organisationId' ]
        })
        if (!inScopeOrgs.includes(organisationId.toString())) {
          throw new AuthenticationError('You do not have access to data from this organisation')
        }
        const catalogueItem = await getRepository(CatalogueItem).update(id, { ...input })
        return catalogueItem
      } catch (err) {
        console.log(err)
      }
    },
    async deleteCatalogueItem (root, { id }, context, info) {
      try {
        const inScopeOrgs = Object.keys(context.scopes)
        const organisationId = await getRepository(CatalogueItem).find({
          where: { id },
          select: [ 'organisationId' ]
        })
        if (!inScopeOrgs.includes(organisationId.toString())) {
          throw new AuthenticationError('You do not have access to data from this organisation')
        }
        const deleted = await getRepository(CatalogueItem).delete(id)
        return deleted
      } catch (err) {
        throw new ApolloError(err)
      }
    }
  }
}
