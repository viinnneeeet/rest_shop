const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');
const ResponseHandler = require('../utils/responseHandler');

function authenticate(req, res, next) {
  try {
    // 1️⃣ Get token from Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return ResponseHandler.unauthorized(res, 'Un authorized user');
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(authHeader, secret);
    req.user = decoded; // attach decoded info to request for later use
    next();
  } catch (err) {
    return ResponseHandler.forbidden(res, 'Invalid or expired token');
  }
}

module.exports = authenticate;
