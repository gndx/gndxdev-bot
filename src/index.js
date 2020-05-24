const tmi = require("tmi.js");
const cron = require("node-cron");
const randomMsg = require('./utils/randomMsg');
const commands = require('./config/commands');
require("dotenv").config();

const welcomeList = ["hola", "buenas", "saludos"];
const username = process.env.USERNAME;
const channel = process.env.CHANNELS_NAME;

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
};

cron.schedule("*/8 * * * *", () => {
  client.say(`#${channel}`, randomMsg());
});

const commandResolve = (target, msg) => {
  switch (msg) {
    case '!merch':
      client.say(target, commands.merch);
      break;
    case '!patreon':
      client.say(target, commands.patreon);
      break;
    case '!blog':
      client.say(target, commands.blog);
      break;
    case '!social':
      client.say(target, commands.social);
      break;
    case '!courses':
      client.say(target, commands.courses);
      break;
    case '!twitch':
      client.say(target, commands.twitch);
      break;
    case '!youtube':
      client.say(target, commands.twitch);
      break;
  };
};

client.on("message", (target, context, msg, self) => {
  if (self) return;
  const text = msg.toLowerCase();
  if (context.username == username) {
    commandResolve(target, msg);
  }
  sendMessage(target, text, welcomeList, `@${context.username} Hola!`);
});

client.on("connected", (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`);
});

client.connect();
