import 'reflect-metadata'
import { createConnection } from 'typeorm'
import  express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
require('dotenv').config()

import { typeDefs, resolvers } from './graphql/index'
import { checkAccessToken, generateAccessToken } from './auth/tokens'


createConnection().then(async connection => {
  console.log('Connected to DB')

  const app = express()
  app.use(cors())
  app.use(async (req, res, next) => {
    console.log('req headers', req.headers)
    const userId = checkAccessToken(req)
    if (userId) {
      req.userId = userId
      res.freshToken = generateAccessToken(userId)
    }
    next()
  })

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (req: any) => ({ userId: req.userId })
  });

  server.applyMiddleware({ app, path: '/api' });

  app.listen({ port: process.env.PORT }, () => {
    console.log(`apollo Server on http://localhost:${process.env.PORT}/api`)
  });
}).catch(error => console.log(error))
