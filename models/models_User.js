import {DataTypes} from "sequelize"
import sequelize from './db.js'

const User = sequelize.define('users',{
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING, unique: true},
    userName: {type: DataTypes.STRING, defaultValue: ''},
    userSticker: {type: DataTypes.STRING, defaultValue: ''},
    right: {type: DataTypes.INTEGER, defaultValue: 0},
    wrong: {type: DataTypes.INTEGER, defaultValue: 0},

})

export default User