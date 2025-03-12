class TokenService {
  constructor(tokenRepository, userRepository, jwtService) {
    this.tokenRepository = tokenRepository;
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async findToken(accessToken) {
    return await this.tokenRepository.findByAccessTokenWithRefresh(accessToken);
  }

  async renewAccessToken(accessToken) {
    const token = await this.tokenRepository.findByAccessTokenWithRefresh(accessToken);
    if (!token) throw new Error('Token not found', { cause: { status: 404 } });

    const tokenData = this.jwtService.verifyToken(token.refreshToken, true);
    if (!tokenData || !tokenData.id)
      throw new Error('Invalid refresh token', { cause: { status: 401 } });

    const user = await this.userRepository.findById(tokenData.id);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });

    const newAccessToken = this.jwtService.signAccessToken({
      id: user.id,
      isAdmin: user.isAdmin,
    });

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