import envs from './models/env.js'
import TelegramBot from 'node-telegram-bot-api';
import { startServiceBot } from './mainService.js';
// import fs from 'fs/promises';

// const lockfile = './My_bot1.lock';

// async function checkIfRunning() {
//     try {
//         await fs.access(lockfile);
//         console.log('Копія додатку вже запущена. Зупиняємо цю копію.');
//         process.exit();

//     } catch (e) {
//         await fs.writeFile(lockfile, process.pid.toString());
//         console.log('Додаток запущено.');

//         const My_bot = new TelegramBot(envs.TELEGRAM_TOKEN);
//         await My_bot.startPolling({ restart: true });
//         startServiceBot(My_bot)
//     }
// }

// process.on('exit', async function () {
//     await fs.unlink(lockfile);
// });

// checkIfRunning();


const bot = new TelegramBot(envs.TELEGRAM_TOKEN,
    { webHook: { port: envs.TELEGRAM_PORT || 3003 } });

bot.setWebHook(`${envs.TELEGRAM_URL}/${envs.TELEGRAM_TOKEN}`);
startServiceBot(bot)