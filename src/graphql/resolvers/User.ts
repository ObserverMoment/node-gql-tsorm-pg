import {getRepository} from 'typeorm'
import {ApolloError} from 'apollo-server'
import User from '../../entity/roles/User'

export const resolvers = {
  Query: {
    async user (root, {id}, context, info) {
      try {
        const user = await getRepository(User).findOne(id)
        return user
      } catch (err) {
        throw new ApolloError(err)
      }
    },
    async users (root, args, context, info) {
      try {
        const users = await getRepository(User).find()
        return users
      } catch (err) {
        throw new ApolloError(err)
      }
    }
  },
  Mutation: {
    async updateUser (root, {id, input}, context, info) {
      try {
        const user = await getRepository(User).update(id, {...input})
        return user
      } catch (err) {
        throw new ApolloError(err)
      }
    }
  },
  User: {
    async organisation (user, {input}, context, info) {
      try {
        return (await getRepository(User)
          .findOne(user.id, {relations: ['roles']})).roles
      } catch (err) {
        throw new ApolloError(err)
      }
    }
  }
}
