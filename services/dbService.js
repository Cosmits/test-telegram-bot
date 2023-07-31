import UserModel from "../models/models_User.js";
import FilesInDB from "../models/model_FIlesInDB.js";

class DbService {

    async findOrCreateUser(chatId, userName = null, right = null, wrong = null, sticker = null) {
        const [userDB, createdUserModel] = await UserModel.findOrCreate({ where: { chatId } })
        if (createdUserModel) {
            userDB.set({
                userName: userName,
                right: 0,
                wrong: 0,       // fireNotebook
                userSticker: 'CAACAgIAAxkBAAIP2GLTMRlCUKQBvRy9IduAJGUD9DdiAAK8DAAChygwSe03kZlYIWgEKQQ',
            });
        } else {
            if (userName != null) userDB.set({ userName });
            if (right != null) userDB.set({ right });
            if (wrong != null) userDB.set({ wrong });
            if (sticker != null) userDB.set({ userSticker: sticker, });
        }
        await userDB.save()
        return createdUserModel
    }

    async getDataUser(chatId) {
        const userDB = await UserModel.findOne({ where: { chatId } })
        return [userDB.userName, userDB.right, userDB.wrong, userDB.userSticker]
    }

    async findBestGamer() {
        const max_right = await UserModel.max('right')
        const userDB = await UserModel.findOne({ where: { right: max_right } })
        return [userDB.userName, userDB.right, userDB.wrong, userDB.userSticker]
    }

    async saveOnDB(chatId, imageData) {
        const [user, created] = await UserModel.findOrCreate({ where: { chatId } })
        await FilesInDB.create({
            chatId: chatId,
            file: imageData,
            user_id: user.id,
        })
    }

    async getFilesListFromDB(chatId) {
        const { count, rows } = await FilesInDB.findAndCountAll({
            where: { chatId },
            stream: true,
            limit: 10 // not more then 10 files
        });
        return rows
    }
}

export default DbService