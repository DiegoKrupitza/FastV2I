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

    server.log.info(`Connected to database at ${url}`)

    collections.cars.insertMany([
      {
        vin: 'first',
        speed: 30,
        location: { type: 'Point', coordinates: [42, 7] },
        timestamp: 12,
      },
      {
        vin: 'second',
        speed: 50,
        location: { type: 'Point', coordinates: [123, 321] },
        timestamp: 10,
      },
    ])

    collections.trafficLights.insertMany([
      {
        id: 'tl-1',
        color: 'green',
        remainingMilliseconds: 5000,
        timestamp: 42,
      },
      {
        id: 'tl-2',
        color: 'red',
        remainingMilliseconds: 1500,
        timestamp: 10,
      },
    ])
  } catch (err) {
    server.log.error(err)
  }
}
