import { FastifyInstance } from 'fastify'

export async function routes(server: FastifyInstance) {
  server.get('/', async (request, reply) => {
    request.log.info('I have been called!')
    return 'hello world'
  })
}
