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

// // For checking user scope against id scope.
// export const getIdFromParent = async (type, id) => {
//   const organisation = await getConnection()
//     .createQueryBuilder()
//     .relation(type, 'organisation')
//     .of(id)
//     .loadOne()
//   return organisation.id
// }
//
// export const getIdFromGrandParent = async (type, parentType, id) => {
//   const parent = await getConnection()
//     .createQueryBuilder()
//     .relation(type, parentType)
//     .of(id)
//     .loadOne()
//   return parent.organisationId
// }
//
// // Data access is scoped to the owning organisation.
// export const getOrganisationId = async (type, id) => {
//   return {
//     CatalogueItem: () => getIdFromParent(type, id),
//     CostOfSale: () => getIdFromGrandParent(type, 'productLine', id)
//   }[type.name]()
// }
