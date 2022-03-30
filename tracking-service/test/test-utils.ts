import type { FastifyInstance } from 'fastify'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { createServer } from '../src/server'

const createTestServer = async (): Promise<FastifyInstance> => {
  const mongod = await MongoMemoryServer.create()
  return createServer({
    isTest: true,
    mongoDbUrl: mongod.getUri(),
  })
}

export const TestUtils = {
  createTestServer,
}
