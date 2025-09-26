const User = require('../models/user.model');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendOTPVerificationEmail = require('../utils/sendMail');
const crypto = require('crypto');
const UserOtp = require('../models/user.otp.model');

//register admin
exports.create_admin = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, phoneNo, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    phoneNo,
    role: role || 'admin',
  });

  return sendToken(user, 200, res, 'Admin Created');
});
//register user
exports.create_user = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, phoneNo, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    phoneNo,
    role: role || 'user',
  });

  return sendToken(user, 200, res, 'User Created');
});

exports.authUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please enter your email & password', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('User is not find with this email', 401));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler('Incorrect Password', 401));
  }
  const { _id } = user;

  return sendOTPVerificationEmail(_id, email, res);
  // return sendToken(user, 201, res, 'Logged in successfully');
});

exports.verifyOtp = catchAsyncErrors(async (req, res, next) => {
  const { otp, userId } = req.body;

  const user = await UserOtp.findOne({ _id: userId });
  console.log(user, 'user');
  return res.json({
    success: true,
    message: 'Logged in Successfully',
  });
});

//Log In
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please enter your email & password', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('User is not find with this email', 401));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler('Incorrect Password', 401));
  }

  return sendToken(user, 201, res, 'Logged in successfully');
});

//Log Out
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logout successfully',
  });
});

//forget password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  //get resetpassword token
  const resetToken = user.getResetToken();

  await user.save({
    validateBeforeSave: false,
  });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v2/user/password/reset/${resetToken}`;

  const message = `Your password reset token is :\n\n ${resetPasswordUrl}`;

  try {
    await sendMail({
      email: user.email,
      subject: 'reset Password',
      message,
    });
    res.status(200).json({
      success: true,
      message: `Mail sent to ${user.email} successfully`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;
    await user.save({
      validateBeforeSave: false,
    });
    return next(new ErrorHandler(err.message, 500));
  }
});

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  //create token hash
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordTime: { $gt: Date.now() },
    resetPasswordToken,
  });

  if (!user) {
    return next(new ErrorHandler('Reset password token is invalid', 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler('Password incorrect', 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTime = undefined;

  await user.save();

  sendToken(user, 200, res);
});
