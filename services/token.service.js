const jwt = require('jsonwebtoken');

class TokenService {
  constructor(tokenRepository, userRepository) {
    this.tokenRepository = tokenRepository;
    this.userRepository = userRepository;
  }

  static async renewAccessToken(accessToken) {
    // Search for the token in the DB through the Repository
    const token = await this.tokenRepository.findByAccessTokenWithRefresh(
      accessToken
    );
    if (!token) throw new Error('Token not found', { cause: { status: 404 } });

    // Verify the refresh token
    const tokenData = jwt.verify(
      token.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!tokenData || !tokenData.id)
      throw new Error('Invalid refresh token', { cause: { status: 401 } });

    // Search for the user in the DB through the Repository
    const user = await this.userRepository.findById(tokenData.id);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });

    // Create a new access token
    const newAccessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '24h' }
    );

    // Update the token in the DB through the Repository
    await this.tokenRepository.updateById(token._id, {
      accessToken: newAccessToken,
    });

    return newAccessToken;
  }

  async deleteToken(userId) {
    const token = await this.tokenRepository.findByUserId(userId);
    if (!token) throw new Error('Token not found', { cause: { status: 404 } });
    try {
      await this.tokenRepository.deleteToken(userId);
    } catch (error) {
      console.error(error);
      throw new Error('Error in deleting token');
    }
  }
}

module.exports = TokenService;
