const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'telegram_base',
    'postgres',
    'qqwwee',
    {
//        host: 'localhost',
        host: 'alibaba.cos.cloudns.cl',
        port: 5432,
        dialect:  'postgres'
    })

