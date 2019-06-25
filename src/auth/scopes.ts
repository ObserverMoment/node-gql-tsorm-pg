import { getRepository } from 'typeorm'
import { AuthenticationError } from 'apollo-server'
import Role from '../entity/roles/Role'

// For creating context
export const getUserScopes = async (user) => {
  const roles = await getRepository(Role)
    .createQueryBuilder('role')
    .innerJoinAndSelect('role.user', 'user')
    .innerJoinAndSelect('role.roleType', 'roleType')
    .where('role.userId = :userId', { userId: user.id })
    .select([
      'role.organisationId',
      'roleType.roleName'
    ])
    .getMany()
  return roles.reduce((acum, next) => ({
    ...acum,
    [next.organisationId]: next.roleType.roleName
  }), {})
}

export const isAdmin = (scopes) => {
  return Object.values(scopes).includes('ADMIN')
}

// NOTE: context.scopes keys are currently string representations of organisation ids.
export const findAndCheckScope = async (type, id, context) => {
  const repo = getRepository(type)
  const entity = await repo.findOne(id)
  const userHasScope = hasScope(entity, context.scopes)
  if (!userHasScope) {
    throw new AuthenticationError('You do not have access to this data')
  }
  return entity
}

export const hasScope = (object, scopes) => {
  const organisationId = getScopingOrganisationId(object)
  return Object.keys(scopes).includes(organisationId.toString())
}

export const getScopingOrganisationId = (object) => {
  return {
    Organisation: () => object.id,
    CatalogueItem: () => object.organisationId
  }[object.constructor.name]()
}
