import 'dotenv/config'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './graphql/index'
import { checkAccessToken, generateAccessToken } from './auth/tokens'
import { getUserScopes } from './auth/scopes'
import schemaDirectives from './graphql/directives/index'

createConnection().then(async connection => {
  console.log('Connected to DB')

  const app = express()
  app.use(cors()) // TODO: I think this can be set on the apollo server middleware below - not in express middleware.

  const createContext = async (req) => {
    try {
      const user = await checkAccessToken(req)
      const scopes = user && await getUserScopes(user)
      return {
        req, user, scopes
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const context = await createContext(req)
      return context
    },
    schemaDirectives
  })

  server.applyMiddleware({ app, path: '/api' })

  app.listen({ port: process.env.PORT }, () => {
    console.log(`apollo Server on http://localhost:${process.env.PORT}/api`)
  })
}).catch(error => console.log(error))
