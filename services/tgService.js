import TelegramBot from "node-telegram-bot-api"

import tokens from "../models/env.js"
import TgKeyboard from './tgKeyboard.js'
import DbService from "./dbService.js"
import FsService from "./fsService.js"

const tgKeyboard = new TgKeyboard()
const dbService = new DbService()
const fsService = new FsService()

const stickers = {
    fireBike: 'CAACAgIAAxkBAAIP3WLTMp98DiDINPKm3fnnRcAixRXPAAJ2EQACwwABKUktuSMZZroOiCkE',
    fireNotebook: 'CAACAgIAAxkBAAIP2GLTMRlCUKQBvRy9IduAJGUD9DdiAAK8DAAChygwSe03kZlYIWgEKQQ',
    // поле з індексом Чата містить тимчасовий стікер для запису в БД
}

const botBuffer = {
    game_message_id: 0,     //повідомлення з Клавіатурою чисел для гри
    try_message_id: 0,      // повідомлення з Зпробою вгадать число
    dbOrDisk_message_id: 0, // повідомлення з Клавіатурою зберегти на диск ЧИ БД
    fullFileName: null,
    count: 0                // кількість спроб вгадати не повинно бути > 9
                            // поле з індексом Чата містить загадане число
}
let fileId = null

const getID = (msg) => (msg.chat) ? msg.chat.id.toString() : msg.from.id.toString()

class TgService {

    constructor(bot) {
        this.bot = bot || new TelegramBot(tokens.TELEGRAM_TOKEN, {polling: true});
    }

    getUserName(msg) {
        const objectInMsg = (msg.chat) ? "chat" : "from"

        let userName = (msg[objectInMsg].username || "") ? msg[objectInMsg].username.toString() : ""

        if (userName === "") {
            let first_name = (msg[objectInMsg].first_name || "") ? msg[objectInMsg].first_name.toString() : ""
            let last_name = (msg[objectInMsg].last_name || "") ? msg[objectInMsg].last_name.toString() : ""
            userName = `${last_name} ${first_name}`.trim()
        }
        return userName
    }

    async SavePhoto(msg) {
        //Спитати куда записати в БД чи на Диск
        fileId = msg.photo[msg.photo.length - 1].file_id;

        const keyboard = tgKeyboard.dbOrDisk()
        const answer = await this.bot.sendMessage(getID(msg), `Зберегти файл`, keyboard)
        botBuffer.dbOrDisk_message_id = answer.message_id
        return answer
    }

    async saveOnDisk(msg, sendMessage = true) {
        const recived_file = await fsService.saveOnDisk(this.bot, fileId)
        try {
            //delete msg (видалити повідомлення з Клавіатурою чисел для гри)
            if (botBuffer.dbOrDisk_message_id > 0) {
                await this.bot.deleteMessage(getID(msg), botBuffer.dbOrDisk_message_id)
            }
        } catch (e) {
            console.log(`--- Error SaveOnDisk = ${botBuffer.dbOrDisk_message_id}`)
        }
        if (sendMessage) {
            return this.bot.sendMessage(getID(msg), `Файл збережений на диск \n\n${recived_file}`)
        }
        botBuffer.fullFileName = recived_file
        return recived_file
    }

    async saveToDB(msg) {
        await this.saveOnDisk(msg, false)
        if (botBuffer.fullFileName != null) {
            const imageData = await fsService.readFileToBuffer(botBuffer.fullFileName)
            // console.log(imageData)
            await dbService.saveOnDB(getID(msg), imageData)
            //Удаляем файл с диска
            await fsService.delFile(botBuffer.fullFileName)
            botBuffer.fullFileName = null
            return this.bot.sendMessage(getID(msg), `Файл завантажено !!!`)
        }
    }

    async getFilesList(msg){
        const { count, rows } = await dbService.getFilesListFromDB(getID(msg))

        // console.log(count);
        // console.log(rows);

        for (let index = 0; index < count; ++index) {
            // console.log(rows[index]);
            await fsService.writeFileFromBuffer(botBuffer, rows[index].dataValues.file)
            await this.bot.sendPhoto(getID(msg), botBuffer.fullFileName)
            //Удаляем файл с диска
            await fsService.delFile(botBuffer.fullFileName)
        }
        botBuffer.fullFileName = null
        return null
    }

    async startCommand(msg) {
        const createdUser = await dbService.findOrCreateUser(msg, getID(msg), this.getUserName(msg))
        const [userName, right, wrong, userSticker] = await dbService.getDataUser(getID(msg))
        const keyboard = tgKeyboard.gameCancellation()

        await this.bot.sendSticker(getID(msg), stickers.fireBike)

        if (createdUser) {
            //this is new user
            return this.bot.sendMessage(getID(msg), `Привіт. ${userName}\nРадий вітати тебе в ТЕЛЕГРАМ БОТІ`, keyboard)
        } else {
            return this.bot.sendMessage(getID(msg), `Привіт. ${userName}\nЗ поверненням тебе в ТЕЛЕГРАМ БОТ`, keyboard)
        }
    }

    async infoCommand(msg) {
        const [userName, right, wrong, userSticker] = await dbService.getDataUser(getID(msg))

        try {
            if (botBuffer.game_message_id > 0) {
                await this.bot.deleteMessage(getID(msg), botBuffer.game_message_id)
            }
        } catch (e) {
            console.log(`--- Error infoCommand = ${botBuffer.game_message_id}`)
        }

        await this.bot.sendSticker(getID(msg), userSticker)
        await this.bot.sendMessage(getID(msg), `Профіль  ${userName}`)

        const keyboard = tgKeyboard.gameCancellation()
        return await this.bot.sendMessage(getID(msg), `Результати Гри  ${right} / ${wrong}`, keyboard)
    }

    async cleanCommand(msg) {
        await dbService.findOrCreateUser(msg, getID(msg), null, 0, 0)
        return this.infoCommand(msg)
    }

    async startGame(msg) {

        try {
            if (botBuffer.game_message_id > 0) {
                await this.bot.deleteMessage(getID(msg), botBuffer.game_message_id)
            }
        } catch (e) {
            console.log(`--- Error startGame game_message_id = ${botBuffer.game_message_id}`)
        }


        await this.bot.sendMessage(getID(msg), `Загадай цифру от 0 до 10`)

        botBuffer[getID(msg)] = Math.floor(Math.random() * 10)
        // console.log(botBuffer[getID(msg)])
        let keyboard = tgKeyboard.gameNumber()
        const answer = await this.bot.sendMessage(getID(msg), `-=Відгадай=-`, keyboard)
        botBuffer.game_message_id = answer.message_id
        return answer
    }

    async gameProcess(msg) {
        let data = msg.data.toString()
        let [userName, right, wrong, userSticker] = await dbService.getDataUser(getID(msg))

        try {
            //delete msg (видалити повідомлення з Зпробою вгадать число)
            if (botBuffer.count > 0 && botBuffer.try_message_id > 0) {
                await this.bot.deleteMessage(getID(msg), botBuffer.try_message_id)
            }
        } catch (e) {
            console.log(`--- Error gameProcess try_message_id = ${botBuffer.try_message_id}`)
        }

        if (data == botBuffer[getID(msg)]) {
            try {
                //delete msg (видалити повідомлення з Клавіатурою чисел для гри)
                if (botBuffer.game_message_id > 0) {
                    await this.bot.deleteMessage(getID(msg), botBuffer.game_message_id)
                }
            } catch (e) {
                console.log(`--- Error gameProcess if data = ${botBuffer.game_message_id}`)
            }

            let keyboard = tgKeyboard.gameAgain()
            await this.bot.sendMessage(getID(msg), `Вітаю, ти вгадав цифру ${data} з ${botBuffer.count + 1} cпроби`, keyboard)

            botBuffer.count = 0
            botBuffer.game_message_id = 0

            right = right + 1

        } else {

            wrong = wrong + 1
            // await dbService.findOrCreateUser(msg, getID(msg),null,null,wrong)

            botBuffer.count += 1
            botBuffer.message_id = msg.message.message_id
            if (botBuffer.count >= 9) {

                try {
                    if (botBuffer.game_message_id > 0) {
                        await this.bot.deleteMessage(getID(msg), botBuffer.game_message_id)
                    }
                } catch (e) {
                    console.log(`--- Error gameProcess else = ${botBuffer.game_message_id}`)
                }

                const keyboard = tgKeyboard.gameAgain()
                const msg_game = await this.bot.sendMessage(getID(msg), `Спроби вичерпались`, keyboard)
                botBuffer.game_message_id = msg_game.message_id
            } else {
                let message_false = await this.bot.sendMessage(getID(msg), `Ти не вгадав. Спроба № ${botBuffer.count}`)
                botBuffer.try_message_id = message_false.message_id
                // console.log(botBuffer.try_message_id)
            }
        }
        return dbService.findOrCreateUser(msg, getID(msg), null, right, wrong)
    }

    async aboutCommand(msg) {
        const text = "1. Цей бот сворений для покращення навиків в Node JS\n" +
            "------------------------------\n" +
            "2. Можливо відправити будь-який текст \n" +
            "------------------------------\n" +
            "3. Відправлена картинка або фото буде збережено на диск або до БазиДаних\n" +
            "------------------------------\n" +
            "4. Відправлений Sticker буде збережений як фото Профіля користувача Бота\n" +
            "------------------------------\n" +
            "5. Можна грати в простеньку гру і дивитись рекорсменів гри"
        return this.bot.sendMessage(getID(msg), text)
    }

    async saveStickerInProfile(msg) {
        // console.log(msg.sticker)
        stickers[getID(msg)] = msg.sticker.file_id

        const keyboard = tgKeyboard.yesNO()
        const msg_game = await this.bot.sendMessage(getID(msg), `Зберегти в Профіль ?`, keyboard)
        botBuffer.game_message_id = msg_game.message_id
        return msg_game
    }

    async yesNO(msg, data) {
        try {
            if (botBuffer.game_message_id > 0) {
                await this.bot.deleteMessage(getID(msg), botBuffer.game_message_id)
            }
        } catch (e) {
            console.log(`--- Error yesNO ${botBuffer.game_message_id}`)
        }

        if (data === '/yes') {
            await dbService.findOrCreateUser(msg, getID(msg), this.getUserName(msg), null, null, stickers[getID(msg)])
            return this.bot.sendMessage(getID(msg), `Новий стікер вже в профілі`)
        } else {  ///    no
            stickers[getID(msg)] = null
            return this.bot.sendMessage(getID(msg), `Іншим разом`)
        }
    }

    async bestGamerCommand(msg) {
        const [userName, right, wrong, userSticker] = await dbService.findBestGamer()
        await this.bot.sendSticker(getID(msg), userSticker)
        await this.bot.sendMessage(getID(msg), `Профіль  ${userName}`)

        const keyboard = tgKeyboard.gameCancellation()
        return await this.bot.sendMessage(getID(msg), `Результати Гри  ${right} / ${wrong}`, keyboard)
    }

    //Send Error in to log and Chat
    async errorCommand(msg, error = undefined, text = '') {
        if (error === undefined) {
            console.log(msg)
            return await this.bot.sendMessage(getID(msg), `Я тебе не розумію \nТи написав повідомлення => ${text}`)
        } else {
            await this.bot.sendMessage(getID(msg), `Error in bot ${text}\n${error}`)
            return console.log(`--- Error in bot !!! ${text}\n`, error)
        }
    }
}

export default TgService