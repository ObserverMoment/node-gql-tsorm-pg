import 'reflect-metadata'
import { createConnection } from 'typeorm'
import  express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './graphql/index'

createConnection().then(async connection => {
  console.log('Connected to DB')

  const app = express()
  app.use(cors())

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  server.applyMiddleware({ app, path: '/graphql' });

  app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
}).catch(error => console.log(error))
