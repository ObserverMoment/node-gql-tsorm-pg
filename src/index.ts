import 'reflect-metadata'
import { createConnection } from 'typeorm'

createConnection().then(async connection => {
  console.log('Connected. Connection info', connection)
}).catch(error => console.log(error))
