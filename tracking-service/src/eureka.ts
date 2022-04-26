import { Eureka } from 'eureka-js-client'
import type { FastifyInstance } from 'fastify'

import { env } from './env'

/**
 * Connect to and register at a eureka instance.
 * @param server - The server. Used for logging.
 */
export function connectToEureka(server: FastifyInstance) {
  const eureka = new Eureka({
    logger: server.log,
    instance: {
      app: 'tracking-service',
      hostName: process.env.HOSTNAME ?? 'localhost',
      ipAddr: env.host,
      statusPageUrl: `http://${process.env.HOSTNAME ?? 'localhost'}:${
        env.port
      }/tracking/health`,
      port: {
        $: env.port,
        '@enabled': true,
      },
      vipAddress: 'tracking-service',
      dataCenterInfo: {
        name: 'MyOwn',
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      },
    },
    eureka: {
      host: process.env.EUREKA_SERVER_ADDRESS ?? 'localhost',
      port: 8761,
      servicePath: '/eureka/apps',
    },
  })
  eureka.start()
  server.log.info('Eureka client created')
}
