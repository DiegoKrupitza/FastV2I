import 'dotenv/config'

export const env = {
  port: parseInt(process.env.port ?? '8888', 10),
  host: '0.0.0.0',
}
