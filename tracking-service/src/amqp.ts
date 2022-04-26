import type { Channel, Connection, ConsumeMessage } from 'amqplib'
import { connect } from 'amqplib'
import type { FastifyInstance } from 'fastify'

import { collections } from './database'
import { Mappers } from './model/mappers'

const CAR_STATE = 'car-state-tracking'
const TRAFFIC_LIGHT_STATE = 'traffic-light-state'

const amqp: { channel?: Channel } = {}

/**
 * Connect to an amqp server and listen for incoming messages.
 * @param server - The server. Used for logging.
 * @param retryDelay - Delay between retries after connection failures.
 */
export async function connectToAmqp(
  server: FastifyInstance,
  retryDelay = 1000
) {
  try {
    const hostname = process.env.RABBIT_MQ_HOST ?? 'localhost'
    const connection = await connect({ hostname })
    amqp.channel = await connection.createChannel()
    server.log.info(`[amqp] Connected to ${hostname}.`)

    server.log.info(`[amqp Listening for queue: ${CAR_STATE}]`)
    server.log.info(`[amqp Listening for queue: ${TRAFFIC_LIGHT_STATE}]`)

    await amqp.channel.assertQueue(CAR_STATE)
    await amqp.channel.assertQueue(TRAFFIC_LIGHT_STATE)

    amqp.channel.consume(CAR_STATE, (msg) =>
      onCarStateMessage(msg, server, amqp.channel)
    )
    amqp.channel.consume(TRAFFIC_LIGHT_STATE, (msg) =>
      onTrafficLightStateMessage(msg, server, amqp.channel)
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

/**
 * Persist an new car state.
 * @param msg - The message.
 * @param server - The server. Used for logging.
 * @param channel - The channel. Used for acknowledging.
 * @returns A promise that resolves when the handler is done.
 */
async function onCarStateMessage(
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
    cars.insertOne(Mappers.carDtoToCar(car))
    channel?.ack(msg)
  } catch (err) {
    server.log.error(
      `[amqp] Could not persist car state "${msg.content.toString()}"`
    )
    channel?.nack(msg)
  }
}

/**
 * Persist an new traffic light state.
 * @param msg - The message.
 * @param server - The server. Used for logging.
 * @param channel - The channel. Used for acknowledging.
 * @returns A promise that resolves when the handler is done.
 */
async function onTrafficLightStateMessage(
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
    trafficLights.insertOne(Mappers.trafficLightDtoToTrafficLight(trafficLight))
    channel?.ack(msg)
  } catch (err) {
    server.log.error(
      `[amqp] Could not persist traffic light state "${msg.content.toString()}"`
    )
    channel?.nack(msg)
  }
}

/**
 * Remove collections and listeners of an amqp client.
 * @param connection - The amqp connection.
 */
function cleanConnection(connection: Connection) {
  amqp.channel?.removeAllListeners()
  amqp.channel = undefined
  connection.removeAllListeners()
}
