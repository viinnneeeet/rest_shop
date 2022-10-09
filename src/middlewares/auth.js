const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  // const token = req.headers.accesstoken;

  if (!token) {
    return next(new ErrorHandler('Please Login for access this resource', 401));
  }
  // console.log(process.env.JWT_SECRET_KEY, 'secret');
  const decodedData = jwt.verify(token, process.env.JWT_KEY);

  req.user = await User.findById(decodedData.id);

  next();
});

// Admin Roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} can not access this resources`)
      );
    }
    next();
  };
};
