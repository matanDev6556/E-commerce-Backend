const { User } = require('./user');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }
  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`, {
        cause: error,
      });
    }
  }

  async findById(id, selectedFields = '') {
    try {
      return await User.findById({ _id: id }).select(selectedFields);
    } catch (error) {
      throw new Error(`Failed to find user by id: ${error.message}`, {
        cause: error,
      });
    }
  }

  async update(userId, updateData) {
    try {
      return await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`, {
        cause: error,
      });
    }
  }

  async getUsers() {
    try {
      return await User.find().select('name email phone');
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`, {
        cause: error,
      });
    }
  }

  async getUsersCount() {
    try {
      return await User.countDocuments();
    } catch (error) {
      throw new Error(`Failed to get users count: ${error.message}`, {
        cause: error,
      });
    }
  }

  async deleteUser(userId) {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`, {
        cause: error,
      });
    }
  }
}

module.exports = UserRepository;
