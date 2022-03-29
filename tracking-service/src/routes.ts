import type { FastifyInstance } from 'fastify'
import { collections } from './database'

export async function routes(server: FastifyInstance) {
  server.get('/', async (request, reply) => {
    request.log.info('I have been called!')
    reply.statusCode = 200
    return 'hello world'
  })

  server.get('/test', async (request, reply) => {
    const doc = await collections.cars?.findOne()
    return doc
  })
}
