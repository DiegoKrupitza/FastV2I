import type { FastifyInstance, FastifyRequest } from 'fastify'
import type { Filter } from 'mongodb'

import { collections } from './database'
import { Mappers } from './model/mappers'
import type { TrafficLight } from './model/traffic-light'

/**
 * Configure routes for a given server.
 * @param server - The server the routes will be added to. Used for logging.
 */
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
      const locationPoint = req.params.location
      const direction = req.params.direction

      server.log.info(`Location: ${locationPoint}`)
      server.log.info(`Direction: ${direction}`)
      let query: Filter<any>

      if (direction === 'NTS') {
        query = { location: { $lte: Number(locationPoint) } }
      } else if (direction === 'STN') {
        query = { location: { $gte: Number(locationPoint) } }
      } else {
        res.statusCode = 400
        return null
      }
      const trafficLight = await collections.trafficLights?.findOne(query, {
        sort: { location: direction === 'STN' ? 1 : -1 },
      })

      server.log.info(trafficLight)
      if (!trafficLight) {
        return null
      }
      if (!isCarInScanDistance(trafficLight, direction, locationPoint)) {
        return null
      }

      return Mappers.trafficLightToTrafficLightDto(trafficLight)
    }
  )

  server.log.info('Routes registered')
}

/**
 * Check if a car is in the scan distance of a traffic light.
 * @param trafficLight - The traffic light.
 * @param carDirection - The direction the car is going.
 * @param carLocation - The location of the car.
 * @returns true if the car is in scan distance.
 */
function isCarInScanDistance(
  trafficLight: TrafficLight,
  carDirection: string,
  carLocation: number
): boolean {
  if (
    carDirection === 'NTS' &&
    carLocation < trafficLight.location + trafficLight.scanDistance
  ) {
    return true
  }
  return (
    carDirection === 'STN' &&
    carLocation > trafficLight.location - trafficLight.scanDistance
  )
}
