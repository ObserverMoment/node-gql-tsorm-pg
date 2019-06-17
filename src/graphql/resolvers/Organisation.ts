import { getRepository } from 'typeorm'
import { ApolloError } from 'apollo-server'
import Organisation from '../../entity/Organisation'

export const resolvers = {
  Query: {
    async organisation (root, { id }, context, info) {
      try {
        const organisation = await getRepository(Organisation).findOne(id)
        return organisation
      } catch (err) {
        throw new ApolloError(err)
      }
    }
  },
  Mutation: {
    async createOrganisation (root, { input }, context, info) {
      try {
        const organisation = await getRepository(Organisation).create({ ...input })
        return organisation
      } catch (err) {
        throw new ApolloError(err)
      }
    },
    async updateOrganisation (root, { id, input }, context, info) {
      try {
        const organisation = await getRepository(Organisation).update(id, { ...input })
        return organisation
      } catch (err) {
        throw new ApolloError(err)
      }
    },
    async deleteOrganisation (root, { id }, context, info) {
      try {
        await getRepository(Organisation).delete(id)
        return true
      } catch (err) {
        throw new ApolloError(err)
      }
    }
  },
  Organisation: {
    async users (organisation, { input }, context, info) {
      try {
        return (await getRepository(Organisation)
          .findOne(organisation.id, { relations: ['roles'] })).roles
      } catch (err) {
        throw new ApolloError(err)
      }
    },
    async catalogueItems (organisation, { input }, context, info) {
      try {
        return (await getRepository(Organisation)
          .findOne(organisation.id, { relations: ['catalogueItems'] })).catalogueItems
      } catch (err) {
        throw new ApolloError(err)
      }
    }
  }
}
