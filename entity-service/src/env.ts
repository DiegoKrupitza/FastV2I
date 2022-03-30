import 'dotenv/config'

export const env = {
  port: parseInt(process.env.port ?? '8889', 10),
  host: '0.0.0.0',
}
