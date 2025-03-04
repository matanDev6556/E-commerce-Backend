const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const authJwt = require('./middlewares/jwt.mid');

module.exports = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(morgan('tiny'));
  app.options('*', cors());
  app.use(authJwt())
  app.use(`/${process.env.API_URL}`, routes);
  return app;
};
