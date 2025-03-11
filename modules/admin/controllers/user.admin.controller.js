class UserAdminController {
  constructor(userService) {
    this.userService = userService;
  }

  getUserCount = async (req, res) => {
    try {
      const count = await this.userService.getUserCount();
      return res.json({ count: count });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error in getting user count' });
    }
  };

  deleteUser = async (req, res) => {
    try {
      await this.userService.deleteUser(req.params.id);
      return res.status(204).end();
    } catch (error) {
      if (error.cause?.status) {
        return res
          .status(error.cause?.status)
          .json({
            success: false,
            message: error.message,
            errorCode: error.cause.status,
          });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: error.message,
      });
    }
  };
}

module.exports = UserAdminController;
