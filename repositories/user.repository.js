const { User } = require('../models/user');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email }).select(
      'name email phone passwordHash '
    );
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findById(id,selectedFields = '') {
    return await User.findById({ _id: id }).select(selectedFields);
  }

  async update(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select('name email phone');
  }

  async getUsers() {
    return await User.find().select('name email phone');
  }

  async getUsersCount() {
    return await User.countDocuments();
  }
  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }
}

module.exports = UserRepository;
