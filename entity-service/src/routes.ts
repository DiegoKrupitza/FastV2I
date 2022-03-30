import type { FastifyInstance, FastifyRequest } from 'fastify'

import { collections } from './database'
import { Mappers } from './model/mappers'

export async function routes(server: FastifyInstance) {
  server.get('/health', async () => {
    return {
      status: 'UP',
    }
  })

  server.get('/cars', async () => {
    const cars = await collections.cars?.find().toArray()
    return (cars ?? []).map(Mappers.carToCarDto)
  })

  server.get(
    '/cars/:vin',
    async (req: FastifyRequest<{ Params: { vin: string } }>, res) => {
      const vin = req.params.vin
      const car = await collections.cars?.findOne({ _id: { $eq: vin } })
      if (!car) {
        res.statusCode = 404
        return null
      }
      return Mappers.carToCarDto(car)
    }
  )

  server.get('/traffic-lights', async () => {
    const trafficLights = await collections.trafficLights?.find().toArray()
    return (trafficLights ?? []).map(Mappers.trafficLightToTrafficLightDto)
  })

  server.log.info('Routes registered')
}
