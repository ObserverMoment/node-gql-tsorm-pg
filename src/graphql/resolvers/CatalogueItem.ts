import CatalogueItem from '../../entity/catalogue/CatalogueItem'
import Organisation from '../../entity/Organisation'
import { fetchOne, fetchMany, setSelectFields, formatWhereFilter } from '../../dataLogic/queries'
import { createEntity, updateEntity, archiveEntity, deleteEntity } from '../../dataLogic/mutations'

export const resolvers = {
  Query: {
    async catalogueItem (root, { id }, context, info) {
      return fetchOne(CatalogueItem, id, context)
    },
    async catalogueItems (root, { organisationId, where = {} }, context, info) {
      const selectObj = setSelectFields(info, ['organisationId'])
      const whereObj = formatWhereFilter(where, { organisationId })
      return fetchMany(CatalogueItem, organisationId, whereObj, selectObj, context)
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
    async archiveCatalogueItem (root, { id }, context, info) {
      return archiveEntity(CatalogueItem, id, context)
    },
    async deleteCatalogueItem (root, { id }, context, info) {
      return deleteEntity(CatalogueItem, id, context)
    }
  }
}
