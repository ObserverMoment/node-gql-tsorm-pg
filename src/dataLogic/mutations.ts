import { getRepository } from 'typeorm'
import { AuthenticationError } from 'apollo-server'
import { isAdmin, findOneAndCheckScope } from '../auth/scopes'
import Organisation from '../entity/Organisation'

// Organisation mutations
export const createOrganisation = async (input, context) => {
  if (!isAdmin(context.scopes)) {
    throw new AuthenticationError('Only site admins can create organisations')
  }
  const repo = getRepository(Organisation)
  const newOrg = repo.create({ ...input })
  const savedOrg = await repo.save(newOrg)
  return savedOrg
}

export const updateOrgansiation = async (id, input, context) => {
  const organisation = await findOneAndCheckScope(Organisation, id, context)
  const updatedOrganisation = {
    ...organisation,
    ...input
  }
  const savedOrganisation = await getRepository(Organisation).save(updatedOrganisation)
  return savedOrganisation
}

export const archiveOrganisation = async (id, context) => {
  if (!isAdmin(context.scopes)) {
    throw new AuthenticationError('Only site admins can archive organisations')
  }
  const repo = getRepository(Organisation)
  const organisation = await repo.findOne(id)
  const updatedOrganisation = {
    ...organisation,
    archivedOn: Date.now()
  }
  const archivedOrganisation = await repo.save(updatedOrganisation)
  return archivedOrganisation
}

export const deleteOrganisation = async (id, context) => {
  if (!isAdmin(context.scopes)) {
    throw new AuthenticationError('Only site admins can delete organisations')
  }
  const deleted = await getRepository(Organisation).remove(id)
  return deleted
}

// Entity mutations
export const createEntity = async (type, parentType, parentId, input, context) => {
  await findOneAndCheckScope(parentType, parentId, context)
  const repo = getRepository(type)
  const newEntity = repo.create({ ...input })
  const savedEntity = await repo.save(newEntity)
  return savedEntity
}

export const updateEntity = async (type, id, input, context) => {
  const entity = await findOneAndCheckScope(type, id, context)
  const updatedEntity = {
    ...entity,
    ...input
  }
  const savedEntity = await getRepository(type).save(updatedEntity)
  return savedEntity
}

export const archiveEntity = async (type, id, context) => {
  const entity = await findOneAndCheckScope(type, id, context)
  const updatedEntity = {
    ...entity,
    archivedOn: Date.now()
  }
  const archivedEntity = await getRepository(type).save(updatedEntity)
  return archivedEntity
}

export const deleteEntity = async (type, id, context) => {
  const entity = await findOneAndCheckScope(type, id, context)
  const deleted = await getRepository(type).remove(entity)
  return deleted
}
