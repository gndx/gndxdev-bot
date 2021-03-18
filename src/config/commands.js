const copies = require("../data/copies.json");

const commands = {
  private: {
    merch: copies.commands.merch,
    blog: copies.commands.blog,
    social: copies.commands.social,
    courses: copies.commands.courses,
    twitch: copies.commands.twitch,
    youtube: copies.commands.youtube
  },
  public: {
    discord: copies.commands.discord
  }
};

module.exports = commands;
