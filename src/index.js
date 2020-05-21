const tmi = require("tmi.js");
const cron = require("node-cron");
require("dotenv").config();

const welcomeList = ["hola", "buenas", "saludos"];

const client = new tmi.client({
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: process.env.CHANNELS_NAME.split(",")
});

const sendMessage = (target, text, list, message) => {
  list.some(t => {
    const includes = text.replace(/ /g, "").includes(t);
    if (includes) client.say(target, message);
    return text.includes(t);
  });
}

cron.schedule("*/10 * * * *", () => {
  client.say(`#${process.env.CHANNELS_NAME}`, "¡hola!");
});

const commands = (target, msg) => {
  switch (msg) {
    case '!fb':
      client.say(target, '!fb message');
      break;
    case '!tw':
      client.say(target, '!tw message');
      break;
    case '!merch':
      client.say(target, '!merch message');
      break;
  }
}

client.on("message", (target, context, msg, self) => {
  if (self) return;
  const text = msg.toLowerCase();
  if (context.badges.broadcaster == 1) {
    console.log(msg)
    commands(target, msg);
  }
  sendMessage(target, text, welcomeList, `@${context.username} Hola!`);
});

client.on("connected", (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`);
});

client.connect();
