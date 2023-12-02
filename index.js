import tokens from './models/env.js'
import TelegramBot from 'node-telegram-bot-api';
import { startServiceBot } from './mainService.js';
import fs from 'fs';

const lockfile = './My_bot.lock';

async function checkIfRunning() {
    if (fs.existsSync(lockfile)) {
        console.log('Копія додатку вже запущена. Зупиняємо цю копію.');
        process.exit();
    } else {
        fs.writeFileSync(lockfile, process.pid);
        console.log('Додаток запущено.');
        const My_bot = new TelegramBot(tokens.TELEGRAM_TOKEN);
        await My_bot.startPolling({ restart: true });
        startServiceBot(My_bot)
    }
}

process.on('exit', function () {
    fs.unlinkSync(lockfile);
});

checkIfRunning();