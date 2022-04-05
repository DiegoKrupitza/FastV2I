import type { FastifyInstance } from 'fastify'
import type { Collection } from 'mongodb'
import { MongoClient } from 'mongodb'

import type { Car } from './model/car'
import type { TrafficLight } from './model/traffic-light'

export const collections: {
  cars?: Collection<Car>
  trafficLights?: Collection<TrafficLight>
} = {}

export async function connectToDatabase(server: FastifyInstance, url: string) {
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

    server.log.info(`[MongoDB] Connected to ${url}`)
  } catch (err) {
    server.log.error(err)
  }
}
