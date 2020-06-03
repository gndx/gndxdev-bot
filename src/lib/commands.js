const Twitter = require("twitter");
const random = require("../utils/random");
const commands = require("../config/commands");
const fetchData = require("./utils/fetchData");
const serviceAccount = require("./serviceAccountKey.json");
const admin = require("firebase-admin");

const STREAMER = "gndxdev";

const clientTwitter = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRECT,
  access_token_key: process.env.TOKEN_KEY,
  access_token_secret: process.env.TOKEN_SECRET
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gndxtwitchbot.firebaseio.com"
});

class Commands {
  constructor(client) {
    this.db = admin.firestore();
    this.client = client;

    this.commands = {
      winner: { fn: this.winner, type: "private" },
      twbot: { fn: this.twbot, type: "private" },
      rifa: { fn: this.rifa, type: "public" },
      cancion: { fn: this.cancion, type: "public" }
    };
  }

  async resolve(context, target, msg) {
    const commandMessage = msg.replace("!", "");
    const privateCommands = context.username === STREAMER;
    const allCommands = {
      ...(privateCommands && this.commands),
      ...(privateCommands && commands.private),
      ...commands.public
    };

    const commandKey = Object.keys(allCommands).find(k =>
      commandMessage.includes(k)
    );

    if (commandKey && commandKey in allCommands) {
      const command = allCommands[commandKey];

      if (typeof command === "function") {
        await command({ context, target, msg });
      } else if (typeof command === "string") {
        this.client.say(target, command);
      }
    }
  }

  twbot({ msg, target }) {
    let msgTwitter = msg.substr(6);
    const msg2 = `${msgTwitter} en vivo: https://twitch.tv/gndxdev #EStreamerCoders`;
    clientTwitter.post("statuses/update", { status: msg2 }, (error, tweet) => {
      if (error) throw error;
      const tweetUrl = `https://twitter.com/i/web/status/${tweet.id_str}`;
      this.client.say(
        target,
        `¡Nuevo Tweet, dale RT! MrDestructoid ${tweetUrl}`
      );
    });
  }

  async cancion({ context, target }) {
    let pretzel = "https://www.pretzel.rocks/api/v1/playing/twitch/gndxdev/";
    let song = await fetchData(pretzel);
    this.client.say(target, `@${context.username}, ${song}`);
  }

  userList = [];
  async rifa({ context, target }) {
    if (this.userList.includes(context.username)) {
      this.client.say(
        target,
        `@${context.username}, ¡Ya estas particiando BibleThump!`
      );
    } else {
      this.userList.push(context.username);
      await this.db.collection("twitch").add({ username: context.username });
      this.client.say(
        target,
        `@${context.username}, ¡Registro exitoso! VoHiYo!`
      );
    }
  }

  async winner({ target }) {
    let winner = [];
    let twitch = this.db.collection("twitch2");
    await twitch
      .orderBy("username", "asc")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          winner.push(doc.data());
        });
      })
      .catch(err => {
        console.log("Error", err);
      });
    let randomUser = random(winner);
    this.client.say(
      target,
      `BloodTrail El Ganador es @${randomUser.username} HolidayPresent`
    );
  }
}

module.exports = Commands;
