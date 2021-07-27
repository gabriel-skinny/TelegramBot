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

    const file = fs.createWriteStream(`./photos/${msg.caption}.png`)
    const fileLink = await bot.getFileLink(msg.photo[1].file_id);

    http.get(`${fileLink}`, (response) => {
      response.pipe(file);
    });


    console.log("ok");

    bot.sendMessage(chatId, 'Arquivo baixado');
  }


  bot.sendMessage(chatId, 'Ok');
});