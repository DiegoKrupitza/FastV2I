import type { FastifyInstance } from 'fastify'
import fastify from 'fastify'
import fastifySwagger from 'fastify-swagger'

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
  server.register(fastifySwagger, {
    routePrefix: 'tracking/documentation-tracking',
    openapi: {
      info: {
        title: 'Tracking Endpoint',
        version: '1.0',
      },
    },
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header: any) => header,
    exposeRoute: true,
  })
  server.log.info(`Starting in ${isTest ? 'test' : 'production'} mode`)

  server.server.keepAliveTimeout = 0
  server.server.requestTimeout = 6000

  server.register(routes, { prefix: '/tracking' })

  await connectToDatabase(server, mongoDbUrl)

  if (isTest) {
    return server
  }

  connectToAmqp(server)
  connectToEureka(server)

  return server
}
