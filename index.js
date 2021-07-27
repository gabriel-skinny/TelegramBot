const TelegramBot = require('node-telegram-bot-api');
const http = require('https'); 
const fs = require('fs');


const token = '1933388008:AAEWIx74qMfEHjSEFFL5mBlv9SCouZUfKcQ';

const bot = new TelegramBot(token, {polling: true});

function download(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  
  http.get(url, response => {
    response.pipe(file);

    file.on("finish", () => {
      file.close(cb);
    })
  }).on("error", err => {
      fs.unlink(dest);
      if (cb) cb(err.message);
  })
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;


  if (msg.photo) {
    const arrayLength = msg.photo.length;

    const fileLink = await bot.getFileLink(msg.photo[arrayLength-1].file_id);

    download(fileLink, `./photos/${msg.caption}.jpeg`, msg => {
      console.log(msg || "Tudo Okay");
    })

    bot.sendMessage(chatId, 'Arquivo baixado');
  }


  bot.sendMessage(chatId, 'Ok');
});