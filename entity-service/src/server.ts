import type { FastifyInstance } from 'fastify'
import fastify from 'fastify'

import { connectToAmqp } from './amqp'
import { connectToDatabase } from './database'
import { connectToEureka } from './eureka'
import { routes } from './routes'

export interface Options {
  isTest: boolean
  mongoDbUrl: string
}

export async function createServer({
  isTest,
  mongoDbUrl,
}: Options): Promise<FastifyInstance> {
  const server = fastify({
    ignoreTrailingSlash: true,
    logger: !isTest && {
      prettyPrint: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname,reqId,remoteAddress,remotePort',
        colorize: true,
      },
    },
  })
  server.log.info(`Starting in ${isTest ? 'test' : 'production'} mode`)

  server.register(routes, { prefix: '/entities' })

  await connectToDatabase(server, mongoDbUrl)

  if (isTest) {
    return server
  }

  connectToAmqp(server)
  connectToEureka(server)

  return server
}
