import { getRepository } from 'typeorm'
import { AuthenticationError } from 'apollo-server'
import { isAdmin, findAndCheckScope } from '../auth/scopes'
import Organisation from '../entity/Organisation'

export const createOrganisation = async (input, context) => {
  if (!isAdmin(context.scopes)) {
    throw new AuthenticationError('Only site admins can create organisations')
  }
  const repo = getRepository(Organisation)
  const newOrg = repo.create({ ...input })
  const savedOrg = await repo.save(newOrg)
  return savedOrg
}

export const deleteOrganisation = async (id, context) => {
  if (!isAdmin(context.scopes)) {
    throw new AuthenticationError('Only site admins can delete organisations')
  }
  const deleted = await getRepository(Organisation).remove(id)
  return deleted
}

export const createEntity = async (type, parentType, parentId, input, context) => {
  await findAndCheckScope(parentType, parentId, context)
  const repo = getRepository(type)
  const newEntity = repo.create({ ...input })
  const savedEntity = await repo.save(newEntity)
  return savedEntity
}

export const updateEntity = async (type, id, input, context) => {
  const entity = await findAndCheckScope(type, id, context)
  const updatedEntity = {
    ...entity,
    ...input
  }
  const savedEntity = await getRepository(type).save(updatedEntity)
  return savedEntity
}

export const deleteEntity = async (type, id, context) => {
  const entity = await findAndCheckScope(type, id, context)
  const deleted = await getRepository(type).remove(entity)
  return deleted
}
