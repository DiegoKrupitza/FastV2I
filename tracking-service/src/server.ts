import type { FastifyInstance } from 'fastify'
import fastify from 'fastify'

import { connectToAmqp } from './amqp'
import type { MongoDBProvider } from './database'
import { connectToDatabase } from './database'
import { connectToEureka } from './eureka'
import { routes } from './routes'

export interface Options {
  isTest: boolean
  mongoDbProvider: MongoDBProvider
}

export function createServer({
  isTest,
  mongoDbProvider,
}: Options): FastifyInstance {
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
  server.log.info(`Starting in ${isTest ? 'test' : 'production'} mode`)

  server.register(routes, { prefix: '/tracking' })

  connectToDatabase(server, mongoDbProvider)

  if (isTest) {
    return server
  }

  connectToAmqp(server)
  connectToEureka(server)

  return server
}
