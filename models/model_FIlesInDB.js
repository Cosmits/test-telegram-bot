import {DataTypes, Model} from "sequelize"

import sequelize from './db.js'
import UserModel from './models_User.js'

////old method creating Models
// const FilesInDB = sequelize.define('files',{
//     id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
//     chatId: {type: DataTypes.STRING, unique: false},
//     userName: {type: DataTypes.STRING, unique: false},
//     file: {type: DataTypes.BLOB('long'), unique: false},
// })


class FilesInDB extends Model {}

FilesInDB.init({
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING, unique: false},
//    userName: {type: DataTypes.STRING, unique: false},
    file: {type: DataTypes.BLOB('long'), unique: false},
    }, {
    sequelize,
    modelName: 'files'
});

UserModel.hasMany(FilesInDB, {as: 'FilesInDB', foreignKey: 'user_id'} );
// const Creator = FilesInDB.belongsTo(UserModel, { as: 'creator' });

export default FilesInDB