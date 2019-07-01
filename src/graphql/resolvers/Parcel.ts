import CatalogueItem from '../../entity/catalogue/CatalogueItem'
import Parcel from '../../entity/catalogue/Parcel'
import {createEntity, updateEntity, archiveEntity, deleteEntity} from '../../dataLogic/mutations'

export const resolvers = {
  Mutation: {
    async createParcel (root, {input}, context, info) {
      const {catalogueItemId} = input
      return createEntity(Parcel, CatalogueItem, catalogueItemId, input, context)
    },
    async updateParcel (root, {id, input}, context, info) {
      return updateEntity(Parcel, id, input, context)
    },
    async deleteParcel (root, {id}, context, info) {
      return deleteEntity(Parcel, id, context)
    }
  }
}
