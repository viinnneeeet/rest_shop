// Get all users
const User = require('../models/user.model');
const Features = require('../utils/Features');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');

exports.createUser = catchAsyncErrors(async (req, res, next) => {
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
  // const _id = req.user;
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
