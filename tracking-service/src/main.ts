import 'dotenv/config'
import fastify from 'fastify'

const server = fastify({
  logger: {
    prettyPrint: {
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
      colorize: true,
      // @ts-expect-error
      singleLine: true,
    },
  },
})

server.get('/', async (request, reply) => {
  request.log.info('I have been called!')
  return 'hello world'
})

server.listen(
  { port: parseInt(process.env.port ?? '8888', 10), host: '0.0.0.0' },
  (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  }
)
