// src/middlewares/error_handler.js
const { tokenService } = require('../modules/auth/di.auth');



async function errorHandler(error, req, res, next) {
  console.log('ERROR OCCURRED:', error.name, error.message);

  if (
    error.name === 'UnauthorizedError' &&
    error.message.includes('jwt expired')
  ) {
    try {
      const newAccessToken = await tokenService.renewAccessToken(
        req.header('Authorization')?.split(' ')[1]
      );
      return res.status(200).json({
        success: true,
        newAccessToken,
        message: 'Token refreshed successfully',
      });
    } catch (refreshError) {
      console.error('Token refresh error:', refreshError);
      return res.status(401).json({
        success: false,
        type: 'Unauthorized',
        message: 'Failed to refresh token',
      });
    }
  }

  // other erros
  res.status(error.status || 500).json({
    success: false,
    type: error.name || 'ServerError',
    message: error.message || 'An unexpected error occurred',
  });

  next(error);
}

module.exports = errorHandler;
