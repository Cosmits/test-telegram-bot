import TelegramApi from 'node-telegram-bot-api'

import tokens from './models/env.js'
import sequelize from './models/db.js'

import TgServices from './services/tgService.js'

const bot = new TelegramApi(tokens.TELEGRAM_TOKEN, {polling: true})
const tgServices = new TgServices(bot)


// This is generals function for start bot
const start = async () => {

    console.log("TELEGRAM_TOKEN = ", tokens.TELEGRAM_TOKEN)

    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log(`Підключення до БД встановлено (lib sequelize)`)
    } catch (e) {
        console.log(`Помилка при підключенні до БД (lib sequelize)\n`, e)
    }

    bot.setMyCommands([
        {command: '/start', description: '🎌 START'},
        {command: '/info', description: '🔎 Профіль користувача'},
        {command: '/about', description: '🤦 Додаткова інформація'},
        {command: '/files_from_db', description: '📦 Прочитати файли з DB📦 Прочитати файли з DB'},
        {command: '/game', description: '🎲 Start Game'},])

    bot.on('message', async msg => {
        let text = (msg.text || "") ? msg.text.toString() : ""

        try {
            // console.log(msg)
            if (msg.photo && msg.photo[msg.photo.length - 1]) {
                return tgServices.SavePhoto(msg)
            } else if (msg.sticker) {
                return tgServices.saveStickerInProfile(msg)
            } else if (text === '/start') {
                return tgServices.startCommand(msg)
            } else if (text === '/info' || text === '🔎 Профіль користувача') {
                return tgServices.infoCommand(msg)
            } else if (text === '/about' || text === '🤦 Додаткова інформація') {
                return tgServices.aboutCommand(msg)
            } else if (text === '❌ Обнулити результати') {
                return tgServices.cleanCommand(msg)
            } else if (text === '🏆 Рекодсмени гри') {
                return tgServices.bestGamerCommand(msg)
            } else if (text === '/game' || text === '🎲 Start Game') {
                return tgServices.startGame(msg)
            } else if (text === '/files_from_db' || text === '📦 Прочитати файли з DB') {
                return tgServices.getFilesList(msg)
            } else {
                return tgServices.errorCommand(msg, undefined, text)
                //return await bot.sendMessage(chatId, `Я тебе не розумію \nТи написав повідомлення => ${text}`)
            }
        } catch (error) {
            return tgServices.errorCommand(msg, error, "")
        }
    })

    bot.on('callback_query', async msg => {
        let data = msg.data.toString()

        // console.log(msg)
        // const userDB = await UserModel.findOne({where: {chatId}})

        if (data === '/again') {
            return tgServices.startGame(msg)
        } else if (data === '/info') {
            return tgServices.infoCommand(msg)
        } else if (data === '/cleanProfile') {
            return tgServices.cleanCommand(msg)
        } else if (data === '/yes' || data === '/no') {
            return tgServices.yesNO(msg, data)
        } else if (data === '/saveToDB') {
             return tgServices.saveToDB(msg)
        } else if (data === '/SaveOnDisk') {
             return tgServices.saveOnDisk(msg)
        } else {
            return tgServices.gameProcess(msg)
        }
        // userDB.userName = msg.message.chat.username.toString()
        // await userDB.save()
        // return  bot.sendMessage(chatId, `Ти нажав | ${data}`)
    })
}

start()