import { MongoClient } from 'mongodb'

import { env } from './env'
import type { Options } from './server'
import { createServer } from './server'

const options: Options = {
  isTest: false,
  mongoDbProvider: (url, options) => new MongoClient(url, options).connect(),
}

createServer(options).listen({ port: env.port, host: env.host }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})
