// utils/responseHandler.js
class ResponseHandler {
  static success(res, data = {}, message = 'Success', status = 200) {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res,
    message = 'Something went wrong',
    error = {},
    status = 500
  ) {
    return res.status(status).json({
      success: false,
      message,
      error,
    });
  }

  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  static forbidden(res, message = 'Forbidden') {
    return res.status(403).json({
      success: false,
      message,
    });
  }

  static unauthorized(res, message = 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message,
    });
  }

  static badRequest(res, message = 'Bad Request', error = {}) {
    return res.status(400).json({
      success: false,
      message,
      error,
    });
  }
}

module.exports = ResponseHandler;
