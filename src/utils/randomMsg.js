const commands = require('../config/commands');

const messages = [
  commands.merch,
  commands.patreon,
  commands.blog,
  commands.social,
  commands.social,
  commands.courses,
  commands.twitch,
];

const randomMsg = () => {
  return messages[Math.floor(Math.random() * messages.length)];
}

module.exports = randomMsg;

