const { validationResult } = require('express-validator');
const ErrorHandler = require('../../helpers/handle_controllers_error');

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = async (req, res) => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed to register');
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(`email - ${email} , pass -  ${password}`);
      const { user, accessToken } = await this.authService.login(
        email,
        password
      );
      res.json({ success: true, data: { ...user._doc, accessToken } });
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed to login ');
    }
  };

  verifyToken = async (req, res, next) => {
    try {
      const accessToken = req.headers.authorization
        ?.replace('Bearer ', '')
        .trim();
      const isValid = await this.authService.verifyToken(accessToken);
      res.json({ success: true, data: isValid });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const response = await this.authService.forgotPassword(email);
      res.json({ success: true, ...response });
    } catch (error) {
      next(error);
    }
  };

  verifyPasswordResetOTP = async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      const response = await this.authService.verifyPasswordResetOTP(
        email,
        otp
      );
      res.json({ success: true, ...response });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
          })),
        });
      }

      const { email, newPassword } = req.body;
      const response = await this.authService.resetPassword(email, newPassword);
      res.json({ success: true, ...response });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;
