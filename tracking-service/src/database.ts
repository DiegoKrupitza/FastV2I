import type { FastifyInstance } from 'fastify'
import type { Collection } from 'mongodb'
import { MongoClient } from 'mongodb'

const collections: { cars?: Collection } = {}

export async function connectToDatabase(server: FastifyInstance) {
  try {
    const client = new MongoClient(
      `mongodb://${process.env.MONGO_DB_HOST}:27017`,
      {
        auth: {
          username: process.env.MONGO_DB_USER,
          password: process.env.MONGO_DB_PWD,
        },
      }
    )
    await client.connect()
    const db = client.db(process.env.MONGO_DB_NAME)
    collections.cars = db.collection('cars')
    server.log.info('Successfully connected to database')
  } catch (err) {
    server.log.error(err)
  }
}
