import fastify from 'fastify'

import { connectToAmqp } from './amqp'
import { connectToDatabase } from './database'
import { env } from './env'
import { connectToEureka } from './eureka'
import { routes } from './routes'

const server = fastify({
  ignoreTrailingSlash: true,
  logger: {
    prettyPrint: {
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname,reqId,remoteAddress,remotePort',
      colorize: true,
    },
  },
})

server.register(routes, { prefix: '/tracking' })

connectToDatabase(server)
connectToAmqp(server)
connectToEureka(server)

server.listen({ port: env.port, host: env.host }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})
