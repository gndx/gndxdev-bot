const copies = require('../data/copies.json');

const commands = {
  merch: copies.commands.merch,
  patreon: copies.commands.patreon,
  blog: copies.commands.blog,
  social: copies.commands.social,
  courses: copies.commands.courses,
  twitch: copies.commands.twitch,
  youtube: copies.commands.youtube,
};

module.exports = commands;
