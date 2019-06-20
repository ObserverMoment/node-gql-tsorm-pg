import path from 'path'
import fs from 'fs'
import glob from 'glob'
import deepmerge from 'deepmerge'

const pathToTypeDefs = path.join(__dirname, './typeDefs')

export const typeDefs = glob
  .sync(`${pathToTypeDefs}/**/*.graphql`)
  .map(x => fs.readFileSync(x, { encoding: 'utf8' }))

const pathToResolvers = path.join(__dirname, './resolvers')

export const resolvers = deepmerge.all(
  glob.sync(`${pathToResolvers}/**/.ts`)
    .map(resolver => require(resolver).resolvers)
)
