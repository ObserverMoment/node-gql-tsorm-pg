import { getRepository } from 'typeorm'
import { UserInputError } from 'apollo-server'
import { findOneAndCheckScope, checkScopeByOrganisationId } from '../auth/scopes'
import Organisation from '../entity/Organisation'

export const setSelectFields = (resolverFieldInfo, additionalFields: string[]) => {
  const requestedFields = resolverFieldInfo.fieldNodes[0].selectionSet.selections
    .filter(field => !field.selectionSet) // Leaf nodes will not have a selectionSet - as this is for a sub object.
    .map(field => field.name.value)
    .concat(additionalFields)
  return { select: requestedFields }
}

interface WhereObject {
  or?: Object[],
  and?: Object,
}

// @param {additional} like { key: valueToMatch, key: valueToMatch } - acts like AND clause on top of where clauses.
// Primarily used for OrganisationId to enusre the user has scope for data access
export const formatWhereFilter = (where: WhereObject = {}, additional) => {
  const { or, and } = where
  if (or && and) {
    throw new UserInputError(`You can't do a 'where' filter with AND and OR at the same time`, {
      invalidArgs: [ 'where.or', 'where.and' ]
    })
  }

  if (!(or || and)) { // Just additional filters
    return { where: { ...additional } }
  }

  // NOTE: In typeorm where AND query is a single object of key value pairs,
  // OR query is an array of such objects, an entity can match any of the array item queries to be returned.
  const formattedWhere = and
    ? {
      ...and,
      ...additional
    }
    : or.map(clause => ({ ...clause, ...additional }))

  return { where: formattedWhere }
}

export const fetchOne = async (type, id, context) => {
  const entity = await findOneAndCheckScope(Organisation, id, context)
  return entity
}

/**
  * @param {where} like { where: {key:value} || [{key:value}] }
  * @param {select} like { select: [stings]}
**/
export const fetchMany = async (type, organisationId, where = null, select = null, context) => {
  const hasScope = checkScopeByOrganisationId(organisationId, context)
  if (hasScope) {
    const entities = await getRepository(type).find({ ...where, ...select })
    return entities
  }
}
