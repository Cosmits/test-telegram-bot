import { Sequelize } from 'sequelize'
import envs from './env.js'

const sequelize = new Sequelize(
    envs.POSTGRESQL_DB,
    envs.POSTGRESQL_USER,
    envs.POSTGRESQL_PASSWORD,
    {
        host: envs.POSTGRESQL_HOST,
        port: envs.POSTGRESQL_PORT,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            }
        },
    })

export default sequelize