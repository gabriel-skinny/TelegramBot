const TelegramBot = require('node-telegram-bot-api');
const http = require('https'); 
const fs = require('fs');
require("dotenv").config();

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

function download(url, dest) {
  return new Promise( (resolve, reject) => {
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
              fs.unlink(dest, () => {}); 
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

    var newCaption = msg.caption;

    if (msg.caption.match("/")) {
        newCaption = msg.caption.replace("/", "-"); 
    }

    download(fileLink, `./photos/${newCaption}.jpeg`)
        .then(() => bot.sendMessage(chatId, "Arquivo baixado"))
        .catch(err => {
            bot.sendMessage(chatId, "Error")
            throw new Error(err)
        })
  }
});