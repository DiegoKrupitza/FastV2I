import type { FastifyInstance } from 'fastify'
import type { Collection, MongoClient, MongoClientOptions } from 'mongodb'

import type { Car } from './model/car'
import type { TrafficLight } from './model/traffic-light'

export type MongoDBProvider = (
  url: string,
  options: MongoClientOptions
) => Promise<MongoClient>

export const collections: {
  cars?: Collection<Car>
  trafficLights?: Collection<TrafficLight>
} = {}

export async function connectToDatabase(
  server: FastifyInstance,
  mongoDbProvider: MongoDBProvider
) {
  try {
    const url = `mongodb://${process.env.MONGO_DB_HOST ?? 'localhost'}:27017`
    const client = await mongoDbProvider(url, {
      auth: {
        username: process.env.MONGO_DB_USER,
        password: process.env.MONGO_DB_PWD,
      },
    })
    const db = client.db(process.env.MONGO_DB_NAME)
    collections.cars = db.collection('cars')
    collections.trafficLights = db.collection('traffic-lights')
    server.log.info(`Connected to database at ${url}`)

    collections.cars.insertMany([
      {
        vin: 'first',
        location: { type: 'Point', coordinates: [42, 7] },
      },
      {
        vin: 'second',
        location: { type: 'Point', coordinates: [123, 321] },
      },
    ])

    collections.trafficLights.insertMany([
      {
        state: {
          color: 'green',
          remainingMilliseconds: 5000,
        },
      },
      {
        state: {
          color: 'red',
          remainingMilliseconds: 1500,
        },
      },
    ])
  } catch (err) {
    server.log.error(err)
  }
}
