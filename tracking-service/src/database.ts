import type { FastifyInstance } from 'fastify'
import type { Collection } from 'mongodb'
import { MongoClient } from 'mongodb'

import type { Car } from './model/car'
import type { TrafficLight } from './model/traffic-light'

export const collections: {
  cars?: Collection<Car>
  trafficLights?: Collection<TrafficLight>
} = {}

export async function connectToDatabase(server: FastifyInstance) {
  try {
    const url = `mongodb://${process.env.MONGO_DB_HOST}:27017`
    const client = new MongoClient(url, {
      auth: {
        username: process.env.MONGO_DB_USER,
        password: process.env.MONGO_DB_PWD,
      },
    })
    await client.connect()
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
