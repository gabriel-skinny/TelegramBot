const TelegramBot = require('node-telegram-bot-api');
const http = require('https'); 
const fs = require('fs');


const token = '1933388008:AAEWIx74qMfEHjSEFFL5mBlv9SCouZUfKcQ';

const bot = new TelegramBot(token, {polling: true});


bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1]; 

  
  bot.sendMessage(chatId, resp);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;


  if (msg.photo) {

    const arrayLength = msg.photo.length;

    const file = fs.createWriteStream(`./photos/${msg.caption}.jpeg`)
    const fileLink = await bot.getFileLink(msg.photo[arrayLength-1].file_id);

    http.get(`${fileLink}`, (response) => {
      response.pipe(file);
    });

    bot.sendMessage(chatId, 'Arquivo baixado');
  }


  bot.sendMessage(chatId, 'Ok');
});