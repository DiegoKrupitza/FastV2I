import 'dotenv/config'
import { Eureka } from 'eureka-js-client'
import fastify from 'fastify'
import { routes } from './routes'

const port = parseInt(process.env.port ?? '8888', 10)
const host = '0.0.0.0'

const eureka = new Eureka({
  instance: {
    app: 'tracking-service',
    hostName: process.env.HOSTNAME ?? 'localhost',
    ipAddr: host,
    port: {
      $: port,
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

function startEureka() {
  eureka.start((err) => {
    if (err) {
      console.warn('Could not start Eureka client. Retrying in 5 seconds.')
      setTimeout(() => startEureka(), 5000)
    }
  })
}

startEureka()

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

server.listen({ port, host }, (err) => {
  if (err) {
    console.error(err)
    eureka.stop()
    process.exit(1)
  }
})
