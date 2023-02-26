const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options')
const token = '5880276311:AAEHJ2618SX2A9oE4ZqMrD0WvJSDhjJM_ts'
const bot = new TelegramApi(token, { polling: true });
const chats = {};


const startGame = async(chatId) => {
    await bot.sendMessage(chatId, 'Я загадываю цифру от 0 до 9, ты угадываешь, поехали!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/info', description: 'Информация о пользователе' },
        { command: '/game', description: 'Веселая игра' },
    ])
    bot.on('sticker', (ctx) => ctx.reply('Иди нахуй'))
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            return bot.sendMessage(chatId, 'Приветствую вас')
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, 'Вас зовут ' + msg.from.first_name + ' ' + msg.from.last_name)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я вас не понимаю, отправьте мне команду')
    })
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, 'Поздравляю, ты огадал цифру ' + chats[chatId], againOptions)
        } else {
            return bot.sendMessage(chatId, 'К сожалению ты не угадал, бот загадал цифру ' + chats[chatId], againOptions)
        }

    })
}

start()