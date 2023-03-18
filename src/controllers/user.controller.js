const { getUsers } = require('../models/user.model');
const User = require('../models/user.model');
const Features = require('../utils/Features');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendMail = require('../utils/sendMail');
const urlConvertor = require('../utils/urlConverter');
const crypto = require('crypto');
const { default: mongoose } = require('mongoose');

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
  let avatar = req?.files?.map((file) => {
    return {
      _id: new mongoose.Types.ObjectId(),
      url: urlConvertor(file?.path),
    };
  });
  console.log(req?.files, 'files');
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
  });
});

// Get all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 1;
  const totalCount = await User.countDocuments();

  const feature = new Features(User.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const users = await feature.query;

  if (!users.length > 0) {
    return res.status(200).json({
      success: false,
      message: 'No user found',
    });
  }
  return res.status(200).json({
    data: users,
    totalCount,
    success: true,
    message: 'Users Details',
  });
});

// Get single users
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const { _id } = req.params;

  const user = await User.findById({ _id });

  if (!user) {
    return next(new ErrorHandler('No User Found', 400));
  }

  return res.status(200).json({
    user,
    success: true,
    message: 'User Details',
  });
});

//Update User Role
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { name, email, role } = req.body;
  const _id = req.user;
  const newUserData = {
    role,
  };

  const user = await User.findByIdAndUpdate(_id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  return res.status(200).json({
    success: true,
    message: 'User profile role',
  });
});

// Delete User
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { _id } = req.params;

  const user = await User.findById(_id);

  await user.remove();

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  return res.status(200).json({
    success: true,
    message: 'User deleted',
  });
});
