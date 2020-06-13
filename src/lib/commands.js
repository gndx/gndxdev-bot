const commands = require("../config/commands");
const CustomCommands = require("./customCommands");

const STREAMER = "gndxdev";

class Commands extends CustomCommands {
  constructor(client) {
    super(client);
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
      if (typeof command.fn === "function") {
        await command.fn.apply(this, [context, target, msg]);
      } else if (typeof command === "string") {
        this.client.say(target, command);
      }
    }
  }
}

module.exports = Commands;
