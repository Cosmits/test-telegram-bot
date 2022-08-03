<h1 align="center">Node.js TEST Telegram Bot</h1>

<div align="center">

Node.js module to interact with the official [Telegram Bot API](https://core.telegram.org/bots/api).

</div>



## Install

Create PostgreSQL data base. Run psql console and type this commands:
```sh
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql

curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

```
```sh
CREATE DATABASE telegram_base;
CREATE USER db_user WITH password 'anypass';
GRANT ALL ON DATABASE telegram_base TO db_user;
```
rename  .env.example to .env,  
setup connection parameters  in file .env

```sh
npm install -g npm
npm install
npm run start
```

Start or Stop bot in background

```sh
npm install pm2
pm2 start index.js
pm2 stop  index.js
```

## Можливості

1. Цей бот сворений для покращення навиків в Node JS  
2. Можливо відправити будь-який текст 
3. Відправлена картинка або фото буде збережено на диск або до БазиДаних
4. Відправлений Sticker буде збережений як фото Профіля користувача Бота
5. Можна грати в простеньку гру і дивитись рекорсменів гри"

## Commands
🎌 START  
🔎 Профіль користувача  
🤦 Додаткова інформація  
🎲 Start Game  
❌ Обнулити результати  
🏆 Рекодсмени гри  
📦 Прочитати файли з DB

## Documentation

* [Node.js Telegram Bot API][Node.js-Telegram-Bot-API]
* [PostgreSQL client][PostgreSQL]
* [Sequelize][sequelize]
* [dotenv][dotenv]

## License

Copyright © 2022 -=Cosmit=-

[dotenv]:https://github.com/motdotla/dotenv
[sequelize]:https://sequelize.org/
[Node.js-Telegram-Bot-API]:https://www.npmjs.com/package/node-telegram-bot-api
[PostgreSQL]:https://www.npmjs.com/package/node-telegram-bot-api