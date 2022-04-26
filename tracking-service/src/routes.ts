import type { FastifyInstance, FastifyRequest } from 'fastify'

import { collections } from './database'
import { Mappers } from './model/mappers'

export async function routes(server: FastifyInstance) {
  server.addSchema({
    $id: 'car',
    type: 'object',
    properties: {
      vin: {
        type: 'string',
        description: 'Vin of car',
      },
      location: {
        type: 'number',
        description: 'horizontal location of car',
      },
      speed: {
        type: 'number',
        description: 'speed of car',
      },
      timestamp: {
        type: 'number',
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
      },
      remainingMilliseconds: {
        type: 'number',
        description: 'remaining time, the traffic light keeps its state',
      },
      color: {
        type: 'string',
        pattern: '^(green|red){1}$',
      },
      location: {
        type: 'number',
        description: 'horizontal location of traffic light on the street',
      },
      timestamp: {
        type: 'number',
      },
    },
  })
  server.get(
    '/health',
    {
      schema: {
        hide: true,
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
        summary: 'Delete all saved entities',
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
        description: 'Get all information about car with specific vin',
        tags: ['endpoints'],
        summary: 'get all information about specific car',
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
            description:
              'Successful response. Is empty when car with vin does not exist',
            content: 'application/json',
            type: 'array',
            items: { $ref: 'car#' },
          },
        },
      },
    },
    async (req: FastifyRequest<{ Params: { vin: string } }>) => {
      const vin = req.params.vin
      const cars = await collections.cars?.find({ vin: { $eq: vin } }).toArray()
      return (cars ?? []).map(Mappers.carToCarDto)
    }
  )

  server.get(
    '/cars/:vin/latest',
    {
      schema: {
        description: 'Get latest information about a car with specified vin',
        tags: ['endpoints'],
        summary: 'get latest specific car',
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
            description:
              'Successful response. Is empty when no car with vin was found',
            content: 'application/json',
            type: 'object',
            $ref: 'car#',
          },
        },
      },
    },
    async (req: FastifyRequest<{ Params: { vin: string } }>) => {
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
        return {}
      }
      return Mappers.carToCarDto(car)
    }
  )

  server.get(
    '/traffic-lights',
    {
      schema: {
        description:
          'Get information about all traffic-lights in database. Is empty when no traffic-light was found',
        tags: ['endpoints'],
        summary: 'get all traffic-lights',
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
        description: 'Get all information about traffic-light with specific id',
        tags: ['endpoints'],
        summary: 'get all information about specific traffic-light',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'traffic-light id',
            },
          },
        },
        response: {
          200: {
            description:
              'Successful response. Is empty when traffic-lights with id does not exist',
            content: 'application/json',
            type: 'array',
            items: { $ref: 'traffic-light#' },
          },
        },
      },
    },
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
    {
      schema: {
        description:
          'Get information about latest traffic-light with specified id',
        tags: ['endpoints'],
        summary: 'get latest specific traffic-light',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'traffic-light id',
            },
          },
        },
        response: {
          200: {
            description:
              'Successful response. Is empty when no traffic-light with id was found',
            content: 'application/json',
            type: 'object',
            $ref: 'traffic-light#',
          },
        },
      },
    },
    async (req: FastifyRequest<{ Params: { id: string } }>) => {
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
        return {}
      }
      return Mappers.trafficLightToTrafficLightDto(trafficLight)
    }
  )

  server.log.info('Routes registered')
}
