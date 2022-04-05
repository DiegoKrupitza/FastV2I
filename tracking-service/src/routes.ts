import type { FastifyInstance, FastifyRequest } from 'fastify'

import { collections } from './database'
import { Mappers } from './model/mappers'

export async function routes(server: FastifyInstance) {
  server.get('/health', async () => {
    return {
      status: 'UP',
    }
  })

  server.delete('/reset', async () => {
    await collections.cars?.deleteMany({})
    await collections.trafficLights?.deleteMany({})
    return null
  })

  server.get('/cars', async () => {
    const cars = await collections.cars?.find().toArray()
    return (cars ?? []).map(Mappers.carToCarDto)
  })

  server.get(
    '/cars/:vin',
    async (req: FastifyRequest<{ Params: { vin: string } }>) => {
      const vin = req.params.vin
      const cars = await collections.cars?.find({ vin: { $eq: vin } }).toArray()
      return (cars ?? []).map(Mappers.carToCarDto)
    }
  )

  server.get(
    '/cars/:vin/latest',
    async (req: FastifyRequest<{ Params: { vin: string } }>, res) => {
      const vin = req.params.vin
      const [car] =
        (await collections.cars
          ?.find({
            vin: { $eq: vin },
          })
          .sort({ timestamp: 'desc' })
          .limit(1)
          .toArray()) ?? []
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

  server.get(
    '/traffic-lights/:id',
    async (req: FastifyRequest<{ Params: { id: string } }>) => {
      const id = req.params.id
      const trafficLights = await collections.trafficLights
        ?.find({
          id: { $eq: id },
        })
        .toArray()
      return (trafficLights ?? []).map(Mappers.trafficLightToTrafficLightDto)
    }
  )

  server.get(
    '/traffic-lights/:id/latest',
    async (req: FastifyRequest<{ Params: { id: string } }>, res) => {
      const id = req.params.id
      const [trafficLight] =
        (await collections.trafficLights
          ?.find({
            id: { $eq: id },
          })
          .sort({ timestamp: 'desc' })
          .limit(1)
          .toArray()) ?? []
      if (!trafficLight) {
        res.statusCode = 404
        return null
      }
      return Mappers.trafficLightToTrafficLightDto(trafficLight)
    }
  )

  server.log.info('Routes registered')
}
