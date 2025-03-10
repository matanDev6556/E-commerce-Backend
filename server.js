const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const authJwt = require('./middlewares/jwt.mid');
const errorHandler = require('./middlewares/error_handler.mid');
const dependencies = require('./config/di');

console.log(dependencies);

module.exports = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(morgan('tiny'));
  app.options('*', cors());
  //app.use(authJwt()); // for evrey req check for authorization
  //app.use(errorHandler); // if the auth failed handle the error
  app.use('/public', express.static(__dirname + '/public')); // for images client uploads
  app.use(`${process.env.API_URL}`, routes); // basic route for api
  return app;
};
