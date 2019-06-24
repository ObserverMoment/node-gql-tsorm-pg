import { getRepository, getConnection } from 'typeorm'
import { AuthenticationError } from 'apollo-server'
import Organisation from '../../entity/Organisation'
import Role from '../../entity/roles/Role'

export const resolvers = {
  Query: {
    async organisation (root, { id }, context, info) {
      try {
        // const inScopeOrgs = Object.keys(context.scopes)
        // if (!inScopeOrgs.includes(id)) {
        //   throw new AuthenticationError('You do not have access to data from this organisation')
        // }
        const organisation = await getRepository(Organisation).findOne(id)
        return organisation
      } catch (err) {
        console.log(err)
      }
    }
  },
  Mutation: {
    async createOrganisation (root, { input }, context, info) {
      try {
        const organisation = await getRepository(Organisation).create({ ...input })
        return organisation
      } catch (err) {
        console.log(err)
      }
    },
    async updateOrganisation (root, { id, input }, context, info) {
      try {
        const inScopeOrgs = Object.keys(context.scopes)
        if (!inScopeOrgs.includes(id)) {
          throw new AuthenticationError('You do not have access to data from this organisation')
        }
        const organisation = await getRepository(Organisation).update(id, { ...input })
        return organisation
      } catch (err) {
        console.log(err)
      }
    },
    async deleteOrganisation (root, { id }, context, info) {
      try {
        const inScopeOrgs = Object.keys(context.scopes)
        if (!inScopeOrgs.includes(id)) {
          throw new AuthenticationError('You do not have access to data from this organisation')
        }
        const deleted = await getRepository(Organisation).delete(id)
        return deleted
      } catch (err) {
        console.log(err)
      }
    }
  },
  Organisation: {
    async usersWithRoles (organisation, { input }, context, info) {
      try {
        const rolesAndUsers = await getRepository(Role)
          .createQueryBuilder('role')
          .innerJoinAndSelect('role.user', 'user')
          .innerJoinAndSelect('role.roleType', 'roleType')
          .where('role.organisationId = :organisationId', { organisationId: organisation.id })
          .select([
            'role.id',
            'user.id', 'user.firstname', 'user.lastname', 'user.email',
            'roleType.id',
            'roleType.roleName'
          ])
          .getMany()
        console.log('roles', rolesAndUsers)
        const usersWithRoles = rolesAndUsers.map(r => ({
          user: { ...r.user },
          roleName: r.roleType.roleName
        }))
        return usersWithRoles
      } catch (err) {
        console.log(err)
      }
    },
    async catalogueItems (organisation, { input }, context, info) {
      console.log('catalogueItems')
      try {
        const catelogueItems = await getConnection()
          .createQueryBuilder()
          .relation(Organisation, 'catalogueItems')
          .of(organisation.id)
          .loadMany()
        return catelogueItems
      } catch (err) {
        console.log(err)
      }
    }
  }
}
