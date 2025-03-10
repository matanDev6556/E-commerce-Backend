const ErrorHandler = require('../../helpers/handle_controllers_error');


class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getUsers = async (req, res) => {
    try {
      const users = await this.userService.getUsers();
      res.json(users);
    } catch (error) {
      return ErrorHandler.handleError(error,res,'Failed to fetch users');
      
    }
  };

  getUserById = async (req, res) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      return res.json({ success: true, data: user });
    } catch (error) {
      return ErrorHandler.handleError(error,res,'Failed to fetch user');
      
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
      return ErrorHandler.handleError(error,res,'Failed to update user');
    }
  };
}

module.exports = UserController;
