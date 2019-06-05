import path from 'path'
import fs from 'fs'
import glob from 'glob'

const pathToResolvers = path.join(__dirname, './resolvers')
const pathToTypeDefs = path.join(__dirname, './typeDefs')

const graphqlTypes = glob
  .sync(`${pathToTypeDefs}/*.graphql`)
  .map(x => fs.readFileSync(x, { encoding: 'utf8' }))

const resolvers = glob
  .sync(`${pathToResolvers}/*.?s`)
  .map(resolver => require(resolver).resolvers)

console.log('graphqlTypes', graphqlTypes)
console.log('resolvers', resolvers)
