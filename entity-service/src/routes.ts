import type { FastifyInstance, FastifyRequest } from 'fastify'

import { collections } from './database'
import { Mappers } from './model/mappers'

export async function routes(server: FastifyInstance) {
  server.get('/health', async () => {
    return {
      status: 'UP',
    }
  })

  server.delete('/all', async () => {
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

  server.get(
    '/traffic-lights/:id',
    async (req: FastifyRequest<{ Params: { id: string } }>, res) => {
      const id = req.params.id
      const trafficLight = await collections.trafficLights?.findOne({
        _id: { $eq: id },
      })
      if (!trafficLight) {
        res.statusCode = 404
        return null
      }
      return Mappers.trafficLightToTrafficLightDto(trafficLight)
    }
  )

  server.get(
    '/traffic-lights/near/:location/:direction',
    async (
      req: FastifyRequest<{ Params: { location: number; direction: string } }>,
      res
    ) => {
      const location = req.params.location
      const direction = req.params.direction

      server.log.info('Location: ', location)

      // mongodb logic stuff
      const trafficLight = await collections.trafficLights?.findOne({})

      if (direction === 'NTS') {
        // make `<=` check
      } else if (direction === 'STN') {
        // make `>=` check
      } else {
        res.statusCode = 400
        return null
      }

      if (!trafficLight) {
        return null
      }

      // TODO: mapper dto stuff
      return {
        id: trafficLight._id,
        position: trafficLight.location.coordinates,
      }
    }
  )

  server.log.info('Routes registered')
}
