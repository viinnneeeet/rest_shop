const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//Store

exports.create_user = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

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
      // user,
      message: 'User Created',
      token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
