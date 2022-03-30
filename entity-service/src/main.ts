import { env } from './env'
import type { Options } from './server'
import { createServer } from './server'

const options: Options = {
  isTest: false,
  mongoDbUrl: `mongodb://${process.env.MONGO_DB_HOST ?? 'localhost'}:27017`,
}

function onError(err?: unknown) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
}

createServer(options)
  .then((server) => server.listen({ port: env.port, host: env.host }, onError))
  .catch(onError)
