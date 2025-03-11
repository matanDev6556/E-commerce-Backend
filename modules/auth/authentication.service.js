const jwt = require('jsonwebtoken');

class Authentication {
  constructor() {
    this.secret = process.env.JWT_SECRET; 
  }

  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      throw new Error('Invalid token', { cause: error });
    }
  }

  verifyUserMatch(token, userId) {
    const tokenData = this.decodeToken(token);
    if (!tokenData || tokenData.id !== userId) {
      throw new Error("User conflict! The user making the request doesn't match the user in the request.", { cause: { status: 401 } });
    }
    return true;
  }

  isValidId(id) {

    return typeof id === 'string' && id.length === 24; 
  }
}

module.exports = new Authentication();