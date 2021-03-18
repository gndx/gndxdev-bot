const tmi = require("tmi.js");
const cron = require("node-cron");
const randomMsg = require("./utils/randomMsg");
const greetings = require("./config/greetings");
const Commands = require("./lib/commands");
require("dotenv").config();

const welcomeList = ["hola", "buenas", "saludos"];
const BOTUSERNAME = process.env.BOT_USERNAME;
const CHANNEL = process.env.CHANNELS_NAME;
const PASSWORD = process.env.OAUTH_TOKEN;

const client = new tmi.client({
  identity: {
    username: BOTUSERNAME,
    password: PASSWORD,
  },
  channels: CHANNEL.split(","),
});

const comm = new Commands(client);

const sendMessage = (target, text, list, message) => {
  list.some((t) => {
    const includes = text.replace(/ /g, "").includes(t);
    if (includes) client.say(target, message);
    return text.includes(t);
  });
};

cron.schedule("*/7 * * * *", () => {
  client.say(`#${CHANNEL}`, randomMsg());
});

client.on("message", async (target, context, msg, self) => {
  if (self) return;
  const text = msg.toLowerCase();

  comm.resolve(context, target, text);

  sendMessage(
    target,
    text,
    welcomeList,
    `@${context.username} ${greetings.hello}`
  );
});

client.on("subscription", (channel, username) => {
  client.say(channel, `${username}, ${greetings.subs}`);
});

client.on("raided", (channel, username, viewers) => {
  client.say(
    channel,
    `TombRaid ¡Raid!, Gracias a ${username} se han unido ${viewers} espectadores, ${greetings.welcome} PogChamp`
  );
});

client.on("connected", (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`);
});

client.connect();
