const TokenRepository = require('./token.repository');
const AuthService = require('./auth.service');
const AuthController = require('./auth.controller');
const JwtService = require('./jwt.service');
const TokenService = require('./token.service');
const { userRepository } = require('../users/di.users');


const tokenRepository = new TokenRepository();
const jwtService = new JwtService();
const tokenService = new TokenService(tokenRepository,userRepository,jwtService);

const createAuthService = (userRepository) => {
  return new AuthService(userRepository, tokenRepository, jwtService);
};

const createAuthController = (authService) => {
  return new AuthController(authService);
};

module.exports = {
  tokenRepository,
  tokenService,
  jwtService,
  createAuthService,
  createAuthController,
};
