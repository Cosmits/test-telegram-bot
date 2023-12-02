import dotenv from 'dotenv'
dotenv.config()

const envs = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  TELEGRAM_URL: process.env.TELEGRAM_URL,
  TELEGRAM_PORT: process.env.TELEGRAM_PORT,

  POSTGRESQL_HOST: process.env.POSTGRESQL_HOST,
  POSTGRESQL_PORT: process.env.POSTGRESQL_PORT,
  POSTGRESQL_DB: process.env.POSTGRESQL_DB,
  POSTGRESQL_USER: process.env.POSTGRESQL_USER,
  POSTGRESQL_PASSWORD: process.env.POSTGRESQL_PASSWORD
}

export default envs