const Twitter = require("twitter");
const random = require("../utils/random");
const fetchData = require("../utils/fetchData");
const serviceAccount = require("../serviceAccountKey.json");
const admin = require("firebase-admin");

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

class CustomCommands {
  commands = {
    winner: { fn: this.winner, type: "private" },
    twbot: { fn: this.twbot, type: "private" },
    rifa: { fn: this.rifa, type: "public" },
    song: { fn: this.song, type: "public" }
  };

  db = admin.firestore();

  constructor(client) {
    this.client = client;
  }

  twbot({ msg, target }) {
    let msgTwitter = msg.substr(6);
    const tweet = `${msgTwitter} en vivo: https://twitch.tv/gndxdev #EStreamerCoders`;
    clientTwitter.post("statuses/update", { status: tweet }, (error, tweet) => {
      if (error) throw error;
      const tweetUrl = `https://twitter.com/i/web/status/${tweet.id_str}`;
      this.client.say(
        target,
        `¡Nuevo Tweet, dale RT! MrDestructoid ${tweetUrl}`
      );
    });
  }

  async song({ context, target }) {
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

module.exports = CustomCommands;
