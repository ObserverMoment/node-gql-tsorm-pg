import 'dotenv/config'
import 'reflect-metadata'
import {createConnection} from 'typeorm'
import express from 'express'
import cors from 'cors'
import {ApolloServer} from 'apollo-server-express'
import {typeDefs, resolvers} from './graphql/index'
import {checkAccessToken} from './auth/tokens'
import {getUserScopes} from './auth/scopes'

createConnection().then(async connection => {
  console.log('Connected to DB')

  const app = express()
  app.use(cors()) // TODO: I think this can be set on the apollo server middleware below - not in express middleware.

  const createContext = async (req) => {
    const authInfo = await checkAccessToken(req)
    const scopes = authInfo && await getUserScopes(authInfo.userId)
    return {
      req,
      userId: authInfo && authInfo.userId,
      tokenInfo: authInfo && authInfo.tokenInfo,
      scopes
    }
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
      const context = await createContext(req)
      return context
    }
  })

  server.applyMiddleware({app, path: '/api'})

  app.listen({port: process.env.PORT}, () => {
    console.log(`apollo Server on http://localhost:${process.env.PORT}/api`)
  })
}).catch(error => console.log(error))
