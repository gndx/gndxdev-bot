const commands = require("../config/commands");

const messages = [...Object.values(commands.private)];
let messagesRandom = shuffleArray(messages);

const randomMsg = () => {
  if (!messagesRandom.length) messagesRandom = shuffleArray(messages);
  return messagesRandom.shift();
};

// Durstenfeld shuffle algorithm
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

module.exports = randomMsg;
