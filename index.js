require('dotenv').config()
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN'
const {gameOptions, againOptions, delOptions} = require('./options')
const TelegramApi       = require('node-telegram-bot-api')
const sequelize = require('./db')
const UserModel = require('./models/models_User')
const {saveFileInToDB}   = require("./method/savefileInTodb")
const {getUserName}     = require("./method/msgMethods");

const bot = new TelegramApi(TELEGRAM_TOKEN, {polling: true })
const chats = {}
const appdir = __dirname.toString()
const stikers = new Map([
    ['fireBike',       'CAACAgIAAxkBAAIP3WLTMp98DiDINPKm3fnnRcAixRXPAAJ2EQACwwABKUktuSMZZroOiCkE'],
    ['fireNotebook',   'CAACAgIAAxkBAAIP2GLTMRlCUKQBvRy9IduAJGUD9DdiAAK8DAAChygwSe03kZlYIWgEKQQ' ],
    ['key3', 'value3']
]);



//+addition functions
const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Загадай цифру от 0 до 10`)

    chats[chatId] = Math.floor(Math.random()*10 )
    await bot.sendMessage(chatId, `-=Отгадай=-`, gameOptions)
}


// This is generals function for start bot
(async () => {

    console.log("TELEGRAM_TOKEN = ",TELEGRAM_TOKEN)

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    }catch (e) {
        console.log(`Error connection to DataBase (lib sequelize)`,e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'START'},
        {command: '/info', description: 'INFO bot'},
        {command: '/game', description: 'GAME   Вгадай число'},
    ])

    bot.on('message', async msg => {
        let chatId = msg.chat.id.toString()
        let text = (msg.text || "") ? msg.text.toString() : ""
        let userName = getUserName(msg)

        try {
            // console.log(msg)
            if (msg.photo && msg.photo[msg.photo.length-1]) {
                return saveFileInToDB(bot, msg, appdir)
            }

            if (text === '/start') {
                const [user, createdUserModel] = await UserModel.findOrCreate({where: {chatId}})
                // const [filesInDB, createdFilesInDB] = await FilesInDB.findOrCreate({where: {chatId}})

                await bot.sendSticker(chatId,stikers.get('fireBike'))

                if (createdUserModel) {
                    //this is new user
                    await bot.sendMessage(chatId, `Привіт. ${userName}\nРадий вітати тебе в ТЕЛЕГРАМ БОТІ`)
                    // console.log('//// start  //// ',user)

                } else {
                    await bot.sendMessage(chatId, `Привіт. ${userName}\nЗ поверненням тебе в ТЕЛЕГРАМ БОТ`)
                    // user.wrong = 0
                    // user.right = 0
                }
                // console.log("userName 000 ",userName)
                user.userName = userName
                return await user.save()
            }

            if (text === '/info') {
                const user = await UserModel.findOne({where: {chatId}})
                // console.log(`/info ${user.userName}  chatId=${chatId}`)
                await bot.sendSticker(chatId,stikers.get('fireNotebook'))
                await bot.sendMessage(chatId, `Профіль  ${userName}`)
                return await bot.sendMessage(chatId, `Результати Гри  ${user.right} / ${user.wrong}`,delOptions)
            }
            if (text === '/game') {
                return startGame(chatId)
            }
            // console.log(msg)
            return await bot.sendMessage(chatId, `Я тебе не розумію \nТи написав повідомлення => ${text}`)

        }catch (e) {
            await bot.sendMessage(chatId,`Error in bot ${e}`)
            return  console.log(`Error in bot`, e)
        }
    })

    bot.on('callback_query' , async msg => {
        let data = msg.data.toString()
        let chatId = msg.message.chat.id.toString()
        // console.log(msg)
        const user = await UserModel.findOne({where: {chatId}})

        if (data === '/again') {
            return startGame(chatId)
        }

        if (data === '/del') {
            user.right = 0
            user.wrong = 0
            await user.save()
            return await bot.sendMessage(chatId, `Результати Гри  ${user.right} / ${user.wrong}`)
        }

        if (data == chats[chatId]) {
            user.right = user.right +1
            await bot.sendMessage(chatId, `Вітаю ти угадав => ${data}`, againOptions)
        } else {
            user.wrong = user.wrong +1
            await bot.sendMessage(chatId, `Ти не угадав.`)
        }
        // user.userName = msg.message.chat.username.toString()
        await user.save()
        // return  bot.sendMessage(chatId, `Ти нажав | ${data}`)
    })
})();

