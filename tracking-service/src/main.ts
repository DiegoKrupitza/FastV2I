import { createServer } from './app'
import { env } from './env'

createServer().listen({ port: env.port, host: env.host }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})
