import type { Channel, ConsumeMessage } from 'amqplib'
import { connect } from 'amqplib'
import type { FastifyInstance } from 'fastify'

import { collections } from './database'
import type { CarDto } from './model/car'
import { Mappers } from './model/mappers'
import type { TrafficLightDto } from './model/traffic-light'

const CAR_STATE = 'car-state'
const TRAFFIC_LIGHT_STATE = 'traffic-light-state'

export const amqp: { channel?: Channel } = {}

export async function connectToAmqp(
  server: FastifyInstance,
  retryDelay = 1000
) {
  try {
    const hostname = process.env.RABBIT_MQ_HOST
    const connection = await connect({ hostname })
    amqp.channel = await connection.createChannel()
    server.log.info(`[amqp] Connected to ${hostname}.`)
    await amqp.channel.assertQueue(CAR_STATE)
    await amqp.channel.assertQueue(TRAFFIC_LIGHT_STATE)
    amqp.channel.consume(CAR_STATE, (msg) => onCarStateMessage(msg, server))
    amqp.channel.consume(TRAFFIC_LIGHT_STATE, (msg) =>
      onTrafficLightStateMessage(msg, server)
    )
  } catch (err) {
    server.log.error(
      `[amqp] Connection failed. Retrying in ${
        retryDelay / 1000
      } second(s). ${err}`
    )
    setTimeout(() => connectToAmqp(server), retryDelay + 1000)
  }
}

async function onCarStateMessage(
  msg: ConsumeMessage | null,
  server: FastifyInstance
): Promise<void> {
  if (!msg) {
    return
  }
  server.log.info(`[amqp] Received message "${msg.content.toString()}"`)
  const cars = collections?.cars
  if (!cars) {
    return
  }
  try {
    const car = JSON.parse(msg.content.toString())
    if (!isValidCarState(car)) {
      return
    }
    cars.insertOne(Mappers.carDtoToCar(car))
  } catch (err) {
    server.log.error(
      `[amqp] Could not persist car state "${msg.content.toString()}"`
    )
  }
}

function isValidCarState(object: any): object is CarDto {
  // TODO
  return true
}

async function onTrafficLightStateMessage(
  msg: ConsumeMessage | null,
  server: FastifyInstance
): Promise<void> {
  if (!msg) {
    return
  }
  server.log.info(`[amqp] Received message "${msg.content.toString()}"`)
  const trafficLights = collections?.trafficLights
  if (!trafficLights) {
    return
  }
  try {
    const trafficLight = JSON.parse(msg.content.toString())
    if (!isValidTrafficLight(trafficLight)) {
      return
    }
    trafficLights.insertOne(trafficLight)
  } catch (err) {
    server.log.error(
      `[amqp] Could not persist traffic light state "${msg.content.toString()}"`
    )
  }
}

function isValidTrafficLight(object: any): object is TrafficLightDto {
  // TODO
  return true
}
