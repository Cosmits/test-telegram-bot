const token = '818463216:AAE-nPMtX74kajvWPzSQZWEcvVvWus656Tw'
const {gameOptions, againOptions, delOptions} = require('./options')
const TelegramApi = require('node-telegram-bot-api')
const sequelize = require('./db')
const UserModel = require('./models/models_User')
const FilesInDB = require('./models/model_FIlesInDB')

const bot = new TelegramApi(token, {polling: true })
const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Загадай цифру от 0 до 10`)

    chats[chatId] = Math.floor(Math.random()*10 )
    await bot.sendMessage(chatId, `-=Отгадай=-`, gameOptions)
}

const start = async () => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    }catch (e) {
        console.log(`Error connection to DB `,e)
    }


    bot.setMyCommands([
        {command: '/start', description: 'START'},
        {command: '/info', description: 'INFO bot'},
        {command: '/game', description: 'GAME   Вгадай число'},
    ])

    bot.on('message', async msg => {
        let chatId = msg.chat.id.toString()
        let text = (msg.text || "") ? msg.text.toString() : ""
        let userName = (msg.chat.username || "") ? msg.chat.username.toString() : ""
        if (userName === "") {
            let first_name = (msg.chat.first_name || "") ? msg.chat.first_name.toString() : ""
            let last_name = (msg.chat.last_name || "") ? msg.chat.last_name.toString() : ""
            userName = `${last_name} ${first_name}`.trim()
        }
        // // console.log(msg)
        // if (msg.photo && msg.photo[0]) {
        //     const image = await bot.getFile({ file_id: msg.photo[0].file_id });
        //     console.log(image);
        // }

        try {
            if (text === '/start') {
                const [user, createdUserModel] = await UserModel.findOrCreate({where: {chatId}})
                const [filesInDB, createdFilesInDB] = await FilesInDB.findOrCreate({where: {chatId}})

                await bot.sendSticker(chatId,'CAACAgIAAxkBAAIP3WLTMp98DiDINPKm3fnnRcAixRXPAAJ2EQACwwABKUktuSMZZroOiCkE')

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
                if (createdFilesInDB) {
                    filesInDB.userName = userName
                    await filesInDB.save()
                }

                return await user.save()
            }

            if (text === '/info') {
                const user = await UserModel.findOne({where: {chatId}})
                // console.log(`/info ${user.userName}  chatId=${chatId}`)
                await bot.sendSticker(chatId,'CAACAgIAAxkBAAIP2GLTMRlCUKQBvRy9IduAJGUD9DdiAAK8DAAChygwSe03kZlYIWgEKQQ')
                await bot.sendMessage(chatId, `Профіль  ${userName}`)
                return await bot.sendMessage(chatId, `Результати Гри  ${user.right} / ${user.wrong}`,delOptions)
            }
            if (text === '/game') {
                return startGame(chatId)
            }
            // console.log(msg)
            return await bot.sendMessage(chatId, `Я тебе не розумію \nТи написав повідомлення => ${text}`)

        }catch (e) {
            console.log(`Error in bot`, e)
            return await bot.sendMessage(chatId,`Error in bot ${e}`)
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
}

start()