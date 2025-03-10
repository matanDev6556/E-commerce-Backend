class ErrorHandler {
  static handleError(error, res, msg) {
    console.error('Error from controoler', error);
    const status = error.cause?.status || 500;
    const message = msg;
    const errorDetails = error.message;

    return res.status(status).json({
      success: false,
      message,
      errorDetails,
    });
  }
}

module.exports = ErrorHandler;
