import type { FastifyInstance } from 'fastify'
import type { Collection } from 'mongodb'
import { MongoClient } from 'mongodb'

import type { Car } from './model/car'
import { Mappers } from './model/mappers'
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

    collections.cars.insertMany(
      [
        {
          vin: 'vw-passat-1',
          oem: 'vw',
          model: 'passat',
        },
        {
          vin: 'vw-polo-1',
          oem: 'vw',
          model: 'polo',
        },
      ].map(Mappers.carDtoToCar)
    )

    collections.trafficLights.insertMany(
      [
        {
          id: 'tl-1',
          location: [1, 1],
        },
        {
          id: 'tl-2',
          location: [42, 7],
        },
      ].map(Mappers.trafficLightDtoToTrafficLight)
    )
  } catch (err) {
    server.log.error(err)
  }
}
