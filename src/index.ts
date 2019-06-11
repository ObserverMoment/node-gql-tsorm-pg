import 'reflect-metadata'
import { createConnection } from 'typeorm'
import  express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
require('dotenv').config()

import { typeDefs, resolvers } from './graphql/index'
import { checkAccessToken } from './auth/tokens'


createConnection().then(async connection => {
  console.log('Connected to DB')

  const app = express()
  app.use(cors())
  app.use(cookieParser())
  app.use(async (req: any, res, next) => {
    console.log('req', req.cookies)
    res.cookie('testcookie', 'testcookie')
    const accessToken = req.cookies['appname-access-token']
    req.userId = accessToken && checkAccessToken(req.cookies['appname-access-token'])
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
