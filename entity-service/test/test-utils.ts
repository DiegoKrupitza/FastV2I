import type { FastifyInstance } from 'fastify'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { collections } from '../src/database'
import { Mappers } from '../src/model/mappers'
import { createServer } from '../src/server'

const createTestServer = async (): Promise<FastifyInstance> => {
  const mongod = await MongoMemoryServer.create()
  const server = await createServer({
    isTest: true,
    mongoDbUrl: mongod.getUri(),
  })
  await insertTestData()
  return server
}

async function insertTestData() {
  await collections.cars?.insertMany(
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

  await collections.trafficLights?.insertMany(
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
}

export const TestUtils = {
  createTestServer,
}
