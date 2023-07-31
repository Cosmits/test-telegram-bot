<h1 align="center">Node.js TEST Telegram Bot</h1>

<div align="center">

Node.js module to interact with the official [Telegram Bot API](https://core.telegram.org/bots/api).

</div>



## Install

Install Node JS 
```sh
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Create PostgreSQL data base. Run psql console and type this commands:
```sh
sudo apt install postgresql postgresql-contrib
sudo ufw allow 5432/tcp

```
You have to edit postgresql.conf file and change line with 'listen_addresses'.
This file you can find in the /etc/postgresql/14/main directory.

```sh
listen_addresses = '*'
```

You will need to add an entry to the pg_hba.conf file that allows connections from the specified host, user, and database using SSL encryption.

```sh
hostssl telegram_base telegram_bot_user 0.0.0.0/0 md5

```
CREATE PostgreSQL DATABASE

```sh
sudo -u postgres psql
CREATE DATABASE telegram_base;
CREATE USER telegram_bot_user WITH password 'anypass` ';
GRANT ALL ON DATABASE telegram_base TO telegram_bot_user;
\q
```
rename  .env.example to .env,  
setup connection parameters  in file .env

```sh
sudo npm install -g npm
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

1. Цей бот створений для покращення навичок в Node JS  
2. Можливо відправити будь-який текст 
3. Відправлена картинка або фото буде збережено на диск або до БазиДаних
4. Відправлений Sticker буде збережений як фото Профілю користувача Бота
5. Можна грати в простеньку гру і дивитись рекордсменів гри"

## Commands
🎌 START
🔎 Профіль користувача
🤦 Додаткова інформація
🎲 Start Game
❌ Обнулити результати
🏆 Рекордсмени гри
📦 Прочитати файли з DB

## Documentation

* [Node.js Telegram Bot API][Node.js-Telegram-Bot-API]
* [PostgreSQL client][PostgreSQL]
* [Sequelize][sequelize]
* [dotenv][dotenv]
* [Database.NET][Database.NET]

## License

Copyright © 2022 -=[CoS]=-

[dotenv]:https://github.com/motdotla/dotenv
[sequelize]:https://sequelize.org/
[Node.js-Telegram-Bot-API]:https://www.npmjs.com/package/node-telegram-bot-api
[PostgreSQL]:https://www.npmjs.com/package/node-telegram-bot-api
[Database.NET]:https://fishcodelib.com/Database.htm