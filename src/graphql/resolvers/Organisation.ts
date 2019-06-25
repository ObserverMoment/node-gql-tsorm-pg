import { getRepository, getConnection } from 'typeorm'
import { AuthenticationError } from 'apollo-server'
import Organisation from '../../entity/Organisation'
import Role from '../../entity/roles/Role'
import { createOrganisation, deleteOrganisation, updateEntity, deleteEntity } from '../../dataLogic/mutations'
import { hasScope, isAdmin } from '../../auth/scopes'

export const resolvers = {
  Query: {
    async organisation (root, { id }, context, info) {
      const organisation = await getRepository(Organisation).findOne(id)
      if (!hasScope(organisation, context.scopes)) {
        throw new AuthenticationError('You do not have access to data from this organisation')
      }
      return organisation
    }
  },
  Mutation: {
    async createOrganisation (root, { input }, context, info) {
      return createOrganisation(input, context)
    },
    async updateOrganisation (root, { id, input }, context, info) {
      return updateEntity(Organisation, id, input, context)
    },
    async deleteOrganisation (root, { id }, context, info) {
      return deleteOrganisation(id, context)
    }
  },
  Organisation: {
    async usersWithRoles (organisation, { input }, context, info) {
      const rolesAndUsers = await getRepository(Role)
        .createQueryBuilder('role')
        .innerJoinAndSelect('role.user', 'user')
        .innerJoinAndSelect('role.roleType', 'roleType')
        .where('role.organisationId = :organisationId', { organisationId: organisation.id })
        .select([
          'role.organisationId',
          'user.id', 'user.firstname', 'user.lastname', 'user.email',
          'roleType.roleName'
        ])
        .getMany()
      const usersWithRoles = rolesAndUsers.map(r => ({
        user: { ...r.user },
        roleName: r.roleType.roleName
      }))
      return usersWithRoles
    },
    async catalogueItems (organisation, { input }, context, info) {
      const catelogueItems = await getConnection()
        .createQueryBuilder()
        .relation(Organisation, 'catalogueItems')
        .of(organisation.id)
        .loadMany()
      return catelogueItems
    }
  }
}
