import fastify from 'fastify'

import { connectToDatabase } from './database'
import { env } from './env'
// import { eureka } from './eureka'
import { routes } from './routes'

const server = fastify({
  logger: {
    prettyPrint: {
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname,reqId,remoteAddress,remotePort',
      colorize: true,
    },
  },
})

server.register(routes)
// server.register(eureka)

connectToDatabase(server)

server.listen({ port: env.port, host: env.host }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})
