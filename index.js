const token = '818463216:AAE-nPMtX74kajvWPzSQZWEcvVvWus656Tw'
const {gameOptions, againOptions} = require('./options.js')
const TelegramApi = require('node-telegram-bot-api')

const bot = new TelegramApi(token, {polling: true })
const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Загадай цифру от 0 до 10`)
    const randomNumber = Math.floor(Math.random()*10 )
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `-=Отгадай=-`, gameOptions)
}

const start = () => {

    bot.setMyCommands([
        {command: '/start', description: 'START'},
        {command: '/info', description: 'INFO bot'},
        {command: '/game', description: 'GAME guess the NUBMER'},
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/e1d/bfa/e1dbfa48-1f85-4b73-88d4-b79706d58305/192/10.webp')
            return  await bot.sendMessage(chatId, `Привіт. Радий вітати тебе ${msg.from.username} в ТЕЛЕГРАМ БОТІ`)
        }
        if (text === '/info') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/e1d/bfa/e1dbfa48-1f85-4b73-88d4-b79706d58305/192/9.webp')
            return await bot.sendMessage(chatId, `Тебе звати  ${msg.from.username}  ${msg.from.first_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }

        return await bot.sendMessage(chatId, `Я тебе не розумію \nТи написав повідомлення => ${text}`)
        // bot.sendMessage(chatId, `Ти написав => ${text}`)
    })

    bot.on('callback_query' , async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }

        if (data == chats[chatId]) {
            await bot.sendMessage(chatId, `Вітаю ти угадав => ${data}`, againOptions)

        } else {
            return await bot.sendMessage(chatId, `Ти не угадав.`)
        }
        // return  bot.sendMessage(chatId, `Ти нажав | ${data}`)
    })
}

start()