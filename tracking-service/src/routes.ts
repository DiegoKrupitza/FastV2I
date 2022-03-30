import type { FastifyInstance, FastifyRequest } from 'fastify'

import { collections } from './database'

export async function routes(server: FastifyInstance) {
  server.get('/health', async (request, reply) => {
    request.log.info('I am still alive!')
    reply.statusCode = 200
    return {
      status: 'UP',
    }
  })

  server.get('/cars', async () => {
    return (await collections.cars?.find().toArray()) ?? []
  })

  server.get(
    '/cars/:vin',
    async (req: FastifyRequest<{ Params: { vin: string } }>, res) => {
      const vin = req.params.vin
      const car = await collections.cars?.findOne({ vin: { $eq: vin } })
      if (!car) {
        res.statusCode = 404
        return null
      }
      return car
    }
  )

  server.get('/traffic-lights', async () => {
    return (await collections.trafficLights?.find().toArray()) ?? []
  })

  server.log.info('Routes registered')
}
