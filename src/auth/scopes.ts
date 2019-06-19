import { getRepository } from 'typeorm'
import Role from '../entity/roles/Role'

// For creating context
export const getUserScopes = async (user) => {
  const roles = await getUserRoles(user)
  return roles.reduce((acum, next) => ({
    ...acum,
    [next.organisation.id]: next.roleType.id
  }), {})
}

export const getUserRoles = async (user) => {
  const repo = getRepository(Role)
  const userRoles = await repo.find({ user: user.id })
  return userRoles || []
}

// // For checking user scope against object scope.
// export const getIdFromParent = async (objectType, object) => {
//   const organisation = await getConnection()
//     .createQueryBuilder()
//     .relation(objectType, 'organisation')
//     .of(object.id)
//     .loadOne()
//   return organisation.id
// }
//
// export const getIdFromGrandParent = async (objectType, parentType, object) => {
//   const parent = await getConnection()
//     .createQueryBuilder()
//     .relation(objectType, parentType)
//     .of(object.id)
//     .loadOne()
//   const organisation = await getConnection()
//     .createQueryBuilder()
//     .relation(parent, 'organisation')
//     .of(object.id)
//     .loadOne()
//   return organisation.id
// }
//
// // Data access is scoped to the owning organisation.
// export const getOrganisationId = async (objectType, object) => {
//   return {
//     CatalogueItem: () => getIdFromParent(objectType, object),
//     CostOfSale: () => getIdFromGrandParent(objectType, 'productLine', object)
//   }[objectType]()
// }
