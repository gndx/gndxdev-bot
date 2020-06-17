const fetch = require('node-fetch');

const fetchData = async (api) => {
  const response = await fetch(api);
  const text = await response.text();
  return text;
};

module.exports = fetchData;