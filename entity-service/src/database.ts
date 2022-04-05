import type { FastifyInstance } from 'fastify'
import type { Collection } from 'mongodb'
import { MongoClient } from 'mongodb'

import type { Car } from './model/car'
import type { TrafficLight } from './model/traffic-light'

export const collections: {
  cars?: Collection<Car>
  trafficLights?: Collection<TrafficLight>
} = {}

export async function connectToDatabase(
  server: FastifyInstance,
  url: string,
  retryDelay = 1000
) {
  try {
    const client = await new MongoClient(url, {
      auth: {
        username: process.env.MONGO_DB_USER,
        password: process.env.MONGO_DB_PWD,
      },
    }).connect()

    const db = client.db(process.env.MONGO_DB_NAME)

    collections.cars = db.collection('cars')
    collections.trafficLights = db.collection('traffic-lights')

    client.on('error', (err) => {
      server.log.error(`[MongoDB] Connection lost. Reconnecting. ${err}`)
      cleanConnection(client)
      client.close()
      connectToDatabase(server, url)
    })
    client.on('close', () => {
      server.log.error('[MongoDB] Connection closed. Reconnecting.')
      cleanConnection(client)
      connectToDatabase(server, url)
    })

    server.log.info(`[MongoDB] Connected to ${url}`)
  } catch (err) {
    server.log.error(
      `[MongoDB] Connection failed. Retrying in ${
        retryDelay / 1000
      } second(s). ${err}`
    )
    setTimeout(
      () => connectToDatabase(server, url, retryDelay + 1000),
      retryDelay
    )
  }
}

function cleanConnection(client: MongoClient) {
  collections.cars = undefined
  collections.trafficLights = undefined
  client.removeAllListeners()
}
