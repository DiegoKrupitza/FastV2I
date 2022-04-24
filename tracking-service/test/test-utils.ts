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
        speed: 30,
        location: 42,
        timestamp: 12,
      },
      {
        vin: 'vw-passat-1',
        speed: 40,
        location: 7,
        timestamp: 15,
      },
      {
        vin: 'vw-polo-1',
        speed: 50,
        location: 123,
        timestamp: 10,
      },
    ].map(Mappers.carDtoToCar)
  )

  await collections.trafficLights?.insertMany(
    [
      {
        id: 'tl-1',
        color: 'green' as const,
        remainingMilliseconds: 5000,
        timestamp: 42,
      },
      {
        id: 'tl-2',
        color: 'red' as const,
        remainingMilliseconds: 1500,
        timestamp: 10,
      },
      {
        id: 'tl-2',
        color: 'green' as const,
        remainingMilliseconds: 3000,
        timestamp: 14,
      },
    ].map(Mappers.trafficLightDtoToTrafficLight)
  )
}

export const TestUtils = {
  createTestServer,
}
