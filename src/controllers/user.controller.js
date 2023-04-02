const User = require('../models/user.model');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendMail = require('../utils/sendMail');
const urlConvertor = require('../utils/urlConverter');
const crypto = require('crypto');

//get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const { _id, name } = req.user;
  const user = await User.findById(_id);

  return res.status(200).json({
    success: true,
    message: `${name} details`,
    user,
  });
});

//Update user password
exports.updateUserPassword = catchAsyncErrors(async (req, res, next) => {
  const { _id } = req.user;
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(_id).select('+password');
  const isPasswordMatch = await user.comparePassword(oldPassword);

  if (!isPasswordMatch) {
    return next(new ErrorHandler('Incorrect Password', 401));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler('Password not matched with each other', 400));
  }

  user.password = newPassword;

  await user.save();

  sendToken(user, 200, res, 'Password updated successfully');
});

// Update user profile
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email, role } = req.body;
  let avatar = urlConvertor(req?.file?.path);
  const _id = req.user;
  const newUserData = {
    name,
    email,
    // role,
    avatar,
  };

  const user = await User.findByIdAndUpdate(_id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  return res.status(200).json({
    success: true,
    message: 'User profile updated',
    avatar,
  });
});
