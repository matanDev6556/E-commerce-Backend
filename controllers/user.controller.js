class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getUsers = async (req, res) => {
    try {
      const users = await this.userService.getUsers();
      res.json(users);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Failed to fetch users', error: error.message });
    }
  };

  getUserById = async (req, res) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      return res.json({ success: true, data: user });
    } catch (error) {
      if (error.cause?.status) {
        return res
          .status(error.cause?.status)
          .json({ success: false, error: error.message });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
        error: error.message,
      });
    }
  };

  updateUser = async (req, res) => {
    try {
      const id = req.params.id;
      const { name, email, phone } = req.body;
      const userData = {
        name,
        email,
        phone,
      };
      const user = await this.userService.updateUser(id, userData);

      return res.json({ success: true, data: user });
    } catch (error) {
      if (error.cause?.status) {
        return res
          .status(error.cause?.status)
          .json({ success: false, error: error.message });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: error.message,
      });
    }
  };
}

module.exports = UserController;
