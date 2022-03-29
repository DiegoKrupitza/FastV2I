import { Eureka } from 'eureka-js-client'
import type { FastifyInstance } from 'fastify'

import { env } from './env'

function startEureka(eureka: Eureka, server: FastifyInstance) {
  eureka.start((err) => {
    if (err) {
      server.log.warn('Could not start Eureka client. Retrying in 5 seconds.')
      setTimeout(() => startEureka(eureka, server), 5000)
    }
  })
}

export function eureka(server: FastifyInstance) {
  const eureka = new Eureka({
    instance: {
      app: 'tracking-service',
      hostName: process.env.HOSTNAME ?? 'localhost',
      ipAddr: env.host,
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
      host: process.env.EUREKA_SERVER_ADDRESS,
      port: 8761,
      servicePath: '/eureka/apps',
    },
  })
  startEureka(eureka, server)
  server.log.info('Eureka client created')
}
