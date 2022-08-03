import {Sequelize} from 'sequelize'
import tokens from './env.js'

const sequelize =  new Sequelize(
    tokens.POSTGRESQL_DB,
    tokens.POSTGRESQL_USER,
    tokens.POSTGRESQL_PASSWORD,
    {
        host: tokens.POSTGRESQL_HOST,
        port: tokens.POSTGRESQL_PORT,
        dialect:  'postgres'
    })

export default sequelize