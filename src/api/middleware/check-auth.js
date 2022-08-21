const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_KEy);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(469).json({
      message: 'Auth failed',
      failed: true,
    });
  }
};
