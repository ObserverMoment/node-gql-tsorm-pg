import { getRepository } from 'typeorm'
import Organisation from '../../entity/Organisation'

const organisationRepo = getRepository(Organisation)

export const resolvers = {
  Query: {
    async organisation (parent, { id }, context, info) {
      return await organisationRepo.findOne(id)
    }
  },
  Mutation: {
    async createOrganisation (parent, { input }, context, info) {
      const organisation = await organisationRepo.create({ ...input })
      return organisation
    },
    async updateOrganisation (parent, { id, input }, context, info) {
      const organisation = await organisationRepo.update(id, { ...input })
      return organisation
    },
    async deleteOrganisation (parent, { id }, context, info) {
      await organisationRepo.delete(id)
      return true
    }
  }
}
