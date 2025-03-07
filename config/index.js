const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

module.exports = {
  BASE_URL,
  API_URL: process.env.API_URL,
};
