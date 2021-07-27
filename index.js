const TelegramBot = require('node-telegram-bot-api');
const http = require('https'); 
const fs = require('fs');


const token = '1933388008:AAEWIx74qMfEHjSEFFL5mBlv9SCouZUfKcQ';

const bot = new TelegramBot(token, {polling: true});

function download(url, dest) {
  return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest, { flags: "wx" });

      const request = http.get(url, response => {
          if (response.statusCode === 200) {
              response.pipe(file);
          } else {
              file.close();
              fs.unlink(dest, () => {});
              reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
          }
      });

      request.on("error", err => {
          file.close();
          fs.unlink(dest, () => {});
          reject(err.message);
      });

      file.on("finish", () => {
          resolve();
      });

      file.on("error", err => {
          file.close();

          if (err.code === "EEXIST") {
              reject("File already exists");
          } else {
              fs.unlink(dest, () => {}); // Delete temp file
              reject(err.message);
          }
      });
  });
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;


  if (msg.photo) {
    const arrayLength = msg.photo.length;

    const fileLink = await bot.getFileLink(msg.photo[arrayLength-1].file_id);

    await download(fileLink, `./photos/${msg.caption}.jpeg`)

    bot.sendMessage(chatId, 'Arquivo baixado');
  }


  bot.sendMessage(chatId, 'Ok');
});