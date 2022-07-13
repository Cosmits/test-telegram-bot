const {Sequelize} = require('sequelize');

module.exports = new Sequelize('telegram_base', 'datacollector_user', 'dDlRkX9gfG8tnBUfYJavN', {
        host: 'localhost',
        port: 5432,
        dialect:  'postgres'
    });

