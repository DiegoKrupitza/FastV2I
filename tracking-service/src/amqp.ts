import type { Channel } from 'amqplib'
import { connect } from 'amqplib'
import type { FastifyInstance } from 'fastify'

export const amqp: { channel?: Channel } = {}

export async function connectToAmqp(server: FastifyInstance) {
  try {
    const url = `amqp://${process.env.RABBIT_MQ_HOST}`
    const connection = await connect(url)
    amqp.channel = await connection.createChannel()
    server.log.info(`Connected to amqp at ${url}`)
    await amqp.channel.assertQueue('cars')
    amqp.channel.sendToQueue('cars', Buffer.from('hello from tracking-service'))
  } catch (err) {
    server.log.error(err)
  }
}
