const { Token } = require('../models/token');

class TokenRepository {
  async findByAccessToken(accessToken) {
    return await Token.findOne({ accessToken });
  }

  async findByUserId(userId) {
    return await Token.findOne({ userId });
  }

  async create(tokenData) {
    const token = new Token(tokenData);
    return await token.save();
  }

  async deleteByUserId(userId) {
    return await Token.deleteOne({ userId });
  }

  async update(tokenId, updateData) {
    return await Token.findByIdAndUpdate(tokenId, updateData, { new: true });
  }

  async findByAccessTokenWithRefresh(accessToken) {
    return await Token.findOne({
      accessToken,
      refreshToken: { $exists: true },
    });
  }

  async updateById(tokenId, updateData) {
    return await Token.updateOne({ _id: tokenId }, updateData).exec();
  }
  async deleteToken(userId) {
    return await Token.deleteOne({ userId: userId });
  }
}

module.exports = TokenRepository;
