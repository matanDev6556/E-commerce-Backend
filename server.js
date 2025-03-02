const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');

module.exports = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(morgan('tiny'));
  app.options('*', cors());
  app.use(`/${process.env.API_URL}`, routes);
  return app;
};
