const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const FilesInDB = sequelize.define('files',{
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING, unique: false},
    userName: {type: DataTypes.STRING, unique: false},
    file: {type: DataTypes.BLOB('long'), unique: false},
})

module.exports = FilesInDB