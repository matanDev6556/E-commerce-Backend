const TokenRepository = require('./token.repository');
const AuthService = require('./auth.service');
const AuthController = require('./auth.controller');

const tokenRepository = new TokenRepository();

const createAuthService = (userRepository) => {
  return new AuthService(userRepository, tokenRepository);
};

const createAuthController = (authService) => {
  return new AuthController(authService);
};

module.exports = {
  tokenRepository,
  createAuthService,
  createAuthController
};