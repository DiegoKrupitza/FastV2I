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
  server.addSchema({
    $id: 'car',
    type: 'object',
    properties: {
      vin: {
        type: 'string',
        description: 'Vin of car',
        example: 'V1',
      },
      oem: {
        type: 'string',
        description: 'oem of car',
        example: 'Tesla',
      },
      model: {
        type: 'string',
        description: 'car model',
        example: 'Model 3',
      },
    },
  })

  server.addSchema({
    $id: 'traffic-light',
    type: 'object',
    nullable: true,
    properties: {
      id: {
        type: 'string',
        description: 'ID of traffic light',
        example: 'T1',
      },
      scanDistance: {
        type: 'number',
        description: 'Scan distance of the traffic light in meters',
        minimum: 10,
        example: 1000,
      },
      location: {
        type: 'number',
        description: 'horizontal location of traffic light on the street',
        example: 5000,
      },
    },
  })
  server.get(
    '/health',
    {
      schema: {
        hide: true,
        description: 'Returns "UP" when entity server is running',
        tags: ['actuator'],
        summary: 'health check',
        response: {
          200: {
            description: 'Successful response',
            content: 'application/json',
            type: 'object',
            properties: {
              status: { type: 'string' },
            },
          },
        },
      },
    },
    async () => {
      return {
        status: 'UP',
      }
    }
  )

  server.delete(
    '/all',
    {
      schema: {
        description: 'Deletes all cars and traffic lights from the database',
        tags: ['endpoints'],
        summary: 'Deletes all entities',
        response: {
          200: {},
        },
      },
    },
    async () => {
      await collections.cars?.deleteMany({})
      await collections.trafficLights?.deleteMany({})
      return null
    }
  )

  server.get(
    '/cars',
    {
      schema: {
        description:
          'Get information about all cars in database. Is empty when no car was found',
        tags: ['endpoints'],
        summary: 'get all cars',
        response: {
          200: {
            description: 'Successful response',
            content: 'application/json',
            type: 'array',
            items: { $ref: 'car#' },
          },
        },
      },
    },
    async () => {
      const cars = await collections.cars?.find().toArray()
      return (cars ?? []).map(Mappers.carToCarDto)
    }
  )

  server.get(
    '/cars/:vin',
    {
      schema: {
        description: 'Get information about a car with specified vin',
        tags: ['endpoints'],
        summary: 'get specific car',
        params: {
          type: 'object',
          properties: {
            vin: {
              type: 'string',
              description: 'car vin',
            },
          },
        },
        response: {
          200: {
            description: 'Successful response',
            content: 'application/json',
            type: 'object',
            $ref: 'car#',
          },
          404: {
            description: 'Error response',
            type: 'object',
            nullable: true,
          },
        },
      },
    },
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

  server.get(
    '/traffic-lights',
    {
      schema: {
        description:
          'Get information about all traffic lights in database. Is empty when no traffic light was found',
        tags: ['endpoints'],
        summary: 'get all traffic lights',
        response: {
          200: {
            description: 'Successful response',
            content: 'application/json',
            type: 'array',
            items: { $ref: 'traffic-light#' },
          },
        },
      },
    },
    async () => {
      const trafficLights = await collections.trafficLights?.find().toArray()
      return (trafficLights ?? []).map(Mappers.trafficLightToTrafficLightDto)
    }
  )

  server.get(
    '/traffic-lights/:id',
    {
      schema: {
        description: 'Get information about a traffic light with specified id',
        tags: ['endpoints'],
        summary: 'get specific traffic light',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'traffic light id',
            },
          },
        },
        response: {
          200: {
            description: 'Successful response',
            content: 'application/json',
            type: 'object',
            $ref: 'traffic-light#',
          },
          404: {
            description: 'Error response',
            type: 'object',
            nullable: true,
          },
        },
      },
    },
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
    {
      schema: {
        description:
          'Is used to find the traffic light in front of a car, where the car is in scan distance of said traffic light',
        tags: ['endpoints'],
        summary: 'get traffic light in front of car within scan distance',
        params: {
          type: 'object',
          properties: {
            location: {
              type: 'number',
              description: 'location of car',
            },
            direction: {
              type: 'string',
              description: 'driving direction of car',
            },
          },
        },
        response: {
          200: {
            description:
              'Successful response. If no traffic light was found near car, returns null',
            content: 'application/json',
            type: 'object',
            $ref: 'traffic-light#',
          },
          400: {
            description: 'Direction was not in pattern NTS or STN',
            type: 'null',
          },
        },
      },
    },
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
