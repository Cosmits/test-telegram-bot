import {Keyboard, Key} from 'telegram-keyboard'

class TgKeyboard {
    constructor() {
    }

    gameNumber() {
        return Keyboard.make([1, 2, 3, 4, 5, 6, 7, 8, 9, 0,
            Key.callback('Вийти', '/info')
        ], {
            pattern: [3, 3, 3, 2]
        }).inline()
    }

    gameAgain() {
        return Keyboard.make([
            Key.callback('Грати ще раз', '/again'),
            Key.callback('Вийти', '/info')
        ], {
            columns: 2
        }).inline()
    }

    yesNO() {
        return Keyboard.make([
            Key.callback('Так', '/yes'),
            Key.callback('Ні', '/no'),
        ], {
            columns: 2
        }).inline()
    }

    dbOrDisk() {
        return Keyboard.make([
            Key.callback('до БД', '/saveToDB'),
            Key.callback('на диск', '/SaveOnDisk'),
        ], {
            columns: 2
        }).inline()
    }

    gameCancellation() {
        return Keyboard.make([
            Key.callback('🔎 Профіль користувача', '/info'),
            Key.callback('🎲 Start Game', '/again'),
            Key.callback('🤦 Додаткова інформація', '/about'),
            Key.callback('❌ Обнулити результати', '/cancellation'),
            Key.callback('📦 Прочитати файли з БазиДаних', '/files_from_db'),
            Key.callback('🏆 Рекордсмени гри', '/bestGamer'),
        ], {
            columns: 2
        }).reply()
    }

}

export default TgKeyboard