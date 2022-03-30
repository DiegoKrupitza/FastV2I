// @ts-expect-error mongo-mock has no type declarations
import { MongoClient } from 'mongo-mock'

import type { MongoDBProvider } from '../src/database'

const createTestMongoDb: MongoDBProvider = (url, options) =>
  MongoClient.connect(`${url}/test-db`, options)

export const TestUtils = {
  createTestMongoDb,
}
