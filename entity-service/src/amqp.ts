import type { Channel, Connection, ConsumeMessage } from 'amqplib'
import { connect } from 'amqplib'
import type { FastifyInstance } from 'fastify'

import { collections } from './database'
import type { CarDto } from './model/car'
import { Mappers } from './model/mappers'
import type { TrafficLightDto } from './model/traffic-light'

const CAR = 'car'
const TRAFFIC_LIGHT = 'traffic-light'

export const amqp: { channel?: Channel } = {}

export async function connectToAmqp(
  server: FastifyInstance,
  retryDelay = 1000
) {
  try {
    const hostname = process.env.RABBIT_MQ_HOST ?? 'localhost'
    const connection = await connect({ hostname })
    amqp.channel = await connection.createChannel()
    server.log.info(`[amqp] Connected to ${hostname}.`)

    server.log.info(`[amqp Listening for queue: ${CAR}]`)
    server.log.info(`[amqp Listening for queue: ${TRAFFIC_LIGHT}]`)

    await amqp.channel.assertQueue(CAR)
    await amqp.channel.assertQueue(TRAFFIC_LIGHT)

    amqp.channel.consume(CAR, (msg) => onCarMessage(msg, server, amqp.channel))
    amqp.channel.consume(TRAFFIC_LIGHT, (msg) =>
      onTrafficLightMessage(msg, server, amqp.channel)
    )

    connection.on('error', (err) => {
      server.log.error(`[amqp] Connection lost. Reconnecting. ${err}`)
      cleanConnection(connection)
      connection.close()
      connectToAmqp(server)
    })
    connection.on('close', () => {
      server.log.error('[amqp] Connection closed. Reconnecting.')
      cleanConnection(connection)
      connectToAmqp(server)
    })
  } catch (err) {
    server.log.error(
      `[amqp] Connection failed. Retrying in ${
        retryDelay / 1000
      } second(s). ${err}`
    )
    setTimeout(() => connectToAmqp(server, retryDelay + 1000), retryDelay)
  }
}

async function onCarMessage(
  msg: ConsumeMessage | null,
  server: FastifyInstance,
  channel?: Channel
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
    if (!isValidCar(car)) {
      return
    }
    cars.updateOne(
      { _id: car.vin },
      { $set: Mappers.carDtoToCar(car) },
      { upsert: true }
    )
    channel?.ack(msg)
  } catch (err) {
    server.log.error(
      `[amqp] Could not persist car state "${msg.content.toString()}"`
    )
    channel?.nack(msg)
  }
}

function isValidCar(object: any): object is CarDto {
  // TODO
  return true
}

async function onTrafficLightMessage(
  msg: ConsumeMessage | null,
  server: FastifyInstance,
  channel?: Channel
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
    trafficLights.updateOne(
      { _id: trafficLight.id },
      { $set: Mappers.trafficLightDtoToTrafficLight(trafficLight) },
      { upsert: true }
    )
    channel?.ack(msg)
  } catch (err) {
    server.log.error(
      `[amqp] Could not persist traffic light state "${msg.content.toString()}"`
    )
    channel?.nack(msg)
  }
}

function isValidTrafficLight(object: any): object is TrafficLightDto {
  // TODO
  return true
}

function cleanConnection(connection: Connection) {
  amqp.channel?.removeAllListeners()
  amqp.channel = undefined
  connection.removeAllListeners()
}
