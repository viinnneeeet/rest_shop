const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//Signup
router.post('/signup', async (req, res, next) => {
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
    .catch();
});
//SignIn
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  await User.find({ email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(200).json({
          message: 'Auth Failed',
          // message: 'Email Does not exist',
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
              expiresIn: '1h',
            }
          );
          return res.status(200).json({
            role: 'admin',
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
});

//Delete User
router.post('/deleteUser', async (req, res, next) => {
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
});

module.exports = router;
