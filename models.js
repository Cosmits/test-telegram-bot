const sequelize = require('./db')
const { DataTypes } = require('sequelize');

module.exports = sequelize.define('user',{
    id: {type: DataTypes.INTEGER, privateKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING, unique: true},
    right: {type: DataTypes.INTEGER, defaultValue: 0},
    wrong: {type: DataTypes.INTEGER, defaultValue: 0},

})

