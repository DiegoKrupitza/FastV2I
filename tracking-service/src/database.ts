import type { FastifyInstance } from 'fastify'
import type { Collection } from 'mongodb'
import { MongoClient } from 'mongodb'

import type { Car } from './model/car'
import type { TrafficLight } from './model/traffic-light'

/**
 * The MongoDB collections.
 */
export const collections: {
  /** The collection of car states. */
  cars?: Collection<Car>
  /** The collection of traffic light states. */
  trafficLights?: Collection<TrafficLight>
} = {}

/**
 * Connect to a MongoDB database.
 * @param server - The server. Used for logging.
 * @param url - The url of the MongoDB server.
 * @param retryDelay - Delay between retries after connection failures.
 */
export async function connectToDatabase(
  server: FastifyInstance,
  url: string,
  retryDelay = 1000
) {
  try {
    const client = await new MongoClient(url, {
      auth: {
        username: process.env.MONGO_DB_USER ?? 'admin',
        password: process.env.MONGO_DB_PWD ?? 'admin',
      },
    }).connect()

    const db = client.db(process.env.MONGO_DB_NAME ?? 'local-tracking-db')

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

/**
 * Remove collections and listeners of a MongoDB client.
 * @param client - The client of the MongoDB connection.
 */
function cleanConnection(client: MongoClient) {
  collections.cars = undefined
  collections.trafficLights = undefined
  client.removeAllListeners()
}
