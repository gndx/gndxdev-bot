const tmi = require("tmi.js");
const cron = require("node-cron");
const randomMsg = require('./utils/randomMsg');
const commands = require('./config/commands');
const greetings = require('./config/greetings');
require("dotenv").config();

const welcomeList = ["hola", "buenas", "saludos"];
const USERNAME = process.env.USERNAME;
const BOTUSERNAME = process.env.BOT_USERNAME;
const CHANNEL = process.env.CHANNELS_NAME;
const PASSWORD = process.env.OAUTH_TOKEN;

const client = new tmi.client({
  identity: {
    username: BOTUSERNAME,
    password: PASSWORD
  },
  channels: CHANNEL.split(",")
});

const sendMessage = (target, text, list, message) => {
  list.some(t => {
    const includes = text.replace(/ /g, "").includes(t);
    if (includes) client.say(target, message);
    return text.includes(t);
  });
};

cron.schedule("*/8 * * * *", () => {
  client.say(`#${CHANNEL}`, randomMsg());
});

const commandResolve = (target, msg) => {
  const commandMessage = msg.replace("!", "");
  const command = commandMessage in commands ? commands[commandMessage] : null;
  if (command) client.say(target, command);
};

client.on("message", (target, context, msg, self) => {
  if (self) return;
  const text = msg.toLowerCase();
  if (context.username == USERNAME) {
    commandResolve(target, msg);
  }
  sendMessage(target, text, welcomeList, `@${context.username} ${greetings.hello}`);
});

client.on("subscription", (channel, username, method, message, userstate) => {
  client.say(channel, `${username}, ${greetings.subs}`);
});

client.on("raided", (channel, username, viewers) => {
  client.say(channel, `TombRaid ¡Raid!, Gracias a ${username} se han unido ${viewers} espectadores, ${greetings.welcome} PogChamp`);
});

client.on("connected", (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`);
});

client.connect();
