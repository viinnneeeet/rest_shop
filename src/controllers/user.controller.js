const User = require('../models/user.model');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//Store

exports.create_user = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log({ name, email, password });
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'https://test.com',
      url: 'https//test.com',
    },
  });
  const token = user.getJwtToken();
  return res.status(201).json({
    success: true,
    message: 'User Created',
    token,
  });
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  console.log({ email, password });

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
  const token = user.getJwtToken();

  return res.status(200).json({
    success: true,
    token,
    message: 'login successfully',
  });
});
