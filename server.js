const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes.main');
const authJwt = require('./middlewares/jwt.mid');
const errorHandler = require('./middlewares/error_handler.mid');
const authorizePostRequests = require('./middlewares/authorizePostRequests.mid');

module.exports = () => {
  const app = express();
  app.use(`${process.env.API_URL}/checkout/webhook`, express.raw({ type: 'application/json' }));
  app.use(express.json());
  app.use(cors());
  app.use(morgan('tiny'));
  app.options('*', cors());
  app.use(authJwt()); // for evrey req check for authorization
  app.use(authorizePostRequests);
  app.use(errorHandler); // if the auth failed handle the error
  app.use('/public', express.static(__dirname + '/public')); // for images client uploads
  app.use(`${process.env.API_URL}`, routes); // basic route for api
  return app;
};
