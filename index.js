import tokens from './models/env.js'
import TelegramBot from 'node-telegram-bot-api';
import { startServiceBot } from './mainService.js';

let bot = null;

async function start() {
    bot = new TelegramBot(tokens.TELEGRAM_TOKEN);
    await bot.startPolling({ restart: true });
    startServiceBot(bot)
}

async function stop() {
    if (bot != null) {
        await bot.stopPolling({ cancel: true });
        bot = null;
    }
    process.exit();
}

start();
process.on('SIGQUIT', stop);
process.on('SIGINT', stop);
