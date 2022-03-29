import { Eureka } from 'eureka-js-client'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

import { env } from './env'

export function eureka(server: FastifyInstance, _: FastifyPluginOptions, done: () => void) {
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
  eureka.start()
  server.log.info('Eureka client created')
  done()
}
