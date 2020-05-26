const tmi = require("tmi.js");
const cron = require("node-cron");
const admin = require("firebase-admin");
const randomMsg = require('./utils/randomMsg');
const random = require('./utils/random');
const commands = require('./config/commands');
const greetings = require('./config/greetings');
require("dotenv").config();

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gndxtwitchbot.firebaseio.com"
});

const db = admin.firestore();

const welcomeList = ["hola", "buenas", "saludos"];
const USERNAME = process.env.USERNAME;
const BOTUSERNAME = process.env.BOT_USERNAME;
const CHANNEL = process.env.CHANNELS_NAME;
const PASSWORD = process.env.OAUTH_TOKEN;
const userList = [];

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

const commandResolve = async (target, msg) => {
  const commandMessage = msg.replace("!", "");
  if (commandMessage === 'winner') {
    let winner = [];
    let twitch = db.collection("twitch");
    let query = await twitch.orderBy("username", "asc").get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          winner.push(doc.data());
        })
      })
      .catch(err => {
        console.log('Error', err);
      });
    let randomUser = random(winner);
    client.say(target, `BloodTrail El Ganador es @${randomUser.username} HolidayPresent`);
  }

  const command = commandMessage in commands ? commands[commandMessage] : null;
  if (command) client.say(target, command);
};

client.on("message", async (target, context, msg, self) => {
  if (self) return;
  const text = msg.toLowerCase();
  const commandRaffle = text.replace("!", "");
  if (commandRaffle === 'rifa') {
    if (userList.includes(context.username)) {
      client.say(target, `@${context.username}, ¡Ya estas particiando BibleThump!`)
    } else {
      userList.push(context.username);
      await db.collection('twitch').add({ username: context.username });
      client.say(target, `@${context.username}, ¡Registro exitoso! VoHiYo!`)
    }
  }

  if (context.username == USERNAME) {
    commandResolve(target, msg);
  }
  sendMessage(target, text, welcomeList, `@${context.username} ${greetings.hello}`);
});

client.on("subscription", (channel, username) => {
  client.say(channel, `${username}, ${greetings.subs}`);
});

client.on("raided", (channel, username, viewers) => {
  client.say(channel, `TombRaid ¡Raid!, Gracias a ${username} se han unido ${viewers} espectadores, ${greetings.welcome} PogChamp`);
});

client.on("connected", (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`);
});

client.connect();
