declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOSTNAME?: string
      PORT: string
      MONGO_DB_HOST: string
      MONGO_DB_USER: string
      MONGO_DB_PWD: string
      MONGO_DB_NAME: string
      RABBIT_MQ_HOST: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
