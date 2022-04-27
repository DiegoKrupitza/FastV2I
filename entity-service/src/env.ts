import 'dotenv/config'

/**
 * Commonly used env constants.
 */
export const env = {
  /** The port of the server. */
  port: parseInt(process.env.port ?? '8889', 10),
  /** The host of the server. Must be '0.0.0.0' for container environments. */
  host: '0.0.0.0',
}
