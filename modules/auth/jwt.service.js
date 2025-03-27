const jwt = require('jsonwebtoken');
require('dotenv').config();

class JwtService {
  signAccessToken(payload, expiresIn = '24h') {
    console.log('signAccessToken: SECRET=', process.env.ACCESS_TOKEN_SECRET); // 🔍 בדיקה

    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error('Missing ACCESS_TOKEN_SECRET in environment variables');
    }

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn });
  }

  
  signRefreshToken(payload, expiresIn = '60d') {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn });
  }

  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Invalid token', { cause: { status: 401 } });
    }
  }

  
  verifyToken(token, isRefresh = false) {
    try {
      const secret = isRefresh
        ? process.env.REFRESH_TOKEN_SECRET
        : process.env.ACCESS_TOKEN_SECRET
      return jwt.verify(token, secret);
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new Error('Invalid token', { cause: { status: 401 } });
    }
  }
}

module.exports = JwtService;
