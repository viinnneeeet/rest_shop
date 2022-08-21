const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

exports.user_sign_in = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.find({ email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(200).json({
          // message: 'Auth Failed',
          message: 'Email Does not exist',
          failed: true,
        });
      }
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) {
          return res.status(200).json({
            // message: 'Auth Failed',
            message: 'Incorrect Password',
            failed: true,
          });
        }
        if (result) {
          const accessToken = jwt.sign(
            { email: user[0].email, _id: user[0]._id },
            process.env.JWT_KEY,
            {
              expiresIn: '2m',
            }
          );
          const data = {
            role: 'admin',
            _id: user[0]._id,
            email: user[0].email,
          };
          return res.status(200).json({
            data,
            accessToken,
            success: true,
            message: 'Auth SuccessFul',
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
        failed: true,
      });
    });
};

exports.user_sign_up = async (req, res, next) => {
  const { email, password } = req.body;
  User.find({ email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Email Exists',
          failed: true,
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: 'User Created',
                  success: true,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  message: err.message,
                  failed: true,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message,
        failed: true,
      });
    });
};

exports.user_delete = async (req, res, next) => {
  const { _id, initiatedBy } = req.body;
  if (initiatedBy === 'admin') {
    await User.remove({ _id })
      .exec()
      .then((data) => {
        res.status(200).json({
          message: 'User deleted',
          success: true,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message,
          failed: true,
        });
      });
  } else {
    return res.status(404).json({
      message: 'Method Not Allowed Forbidden Access',
      failed: true,
    });
  }
};

exports.user_refresh_token = async (req, res, next) => {
  try {
    const { _id, email, accessToken } = req.body;

    if ((_id, email, accessToken)) {
      const refreshToken = jwt.sign({ _id, email }, process.env.JWT_KEY, {
        expiresIn: '2m',
      });
      return res.status(200).json({
        accessToken: refreshToken,
        success: true,
        message: 'Refresh Token ',
      });
    } else {
      return res.status(400).json({
        failed: true,
        message: 'Please Login',
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};