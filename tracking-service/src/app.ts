import type { FastifyInstance } from 'fastify'
import fastify from 'fastify'
import { MongoClient } from 'mongodb'

import { connectToAmqp } from './amqp'
import { connectToDatabase } from './database'
import { connectToEureka } from './eureka'
import { routes } from './routes'

export function createServer(isTest = false): FastifyInstance {
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

  connectToDatabase(server, (url, options) =>
    isTest
      ? // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('mongo-mock').MongoClient(url)
      : new MongoClient(url, options)
  )

  if (isTest) {
    return server
  }

  connectToAmqp(server)
  connectToEureka(server)

  return server
}
