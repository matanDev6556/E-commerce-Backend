const jwt = require('jsonwebtoken');

class JwtService {
  signAccessToken(payload, expiresIn = '24h') {
    console.log('sign acesss', this.accessTokenSecret);
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn });
  }

  // חתימת Refresh Token
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

  // אימות טוקן
  verifyToken(token, isRefresh = false) {
    try {
      const secret = isRefresh
        ? this.refreshTokenSecret
        : this.accessTokenSecret;
      return jwt.verify(token, secret);
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new Error('Invalid token', { cause: { status: 401 } });
    }
  }
}

module.exports = JwtService;
