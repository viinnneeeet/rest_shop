const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

exports.user_sign_in = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const data = await User.findOne({ email });

    if (!data) {
      res.status(400).json({
        message: 'Email does not exist',
        failed: true,
      });
    }

    if (data) {
      const result = await bcrypt.compare(password, data.password);
      if (result) {
        const accessToken = jwt.sign(
          { email: data.email, _id: data._id },
          process.env.JWT_KEY,
          {
            expiresIn: '1m',
          }
        );
        const user = {
          role: data.role,
          _id: data._id,
          email: data.email,
        };
        return res.status(200).json({
          user,
          accessToken,
          success: true,
          message: 'Auth SuccessFul',
        });
      } else {
        return res.status(400).json({
          //           // message: 'Auth Failed',
          message: 'Incorrect Password',
          failed: true,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
      failed: true,
    });
  }
  // const user = await User.find({ email })
  //   .exec()
  //   .then((user) => {
  //     if (user.length < 1) {
  //       return res.status(400).json({
  //         // message: 'Auth Failed',
  //         message: 'Email Does not exist',
  //         failed: true,
  //       });
  //     }
  //     bcrypt.compare(password, user[0].password, (err, result) => {
  //       if (err) {
  //         return res.status(400).json({
  //           // message: 'Auth Failed',
  //           message: 'Incorrect Password',
  //           failed: true,
  //         });
  //       }
  //       if (result) {
  //         const accessToken = jwt.sign(
  //           { email: user[0].email, _id: user[0]._id },
  //           process.env.JWT_KEY,
  //           {
  //             expiresIn: '1h',
  //           }
  //         );
  //         const user = {
  //           role: 'user',
  //           _id: user[0]._id,
  //           email: user[0].email,
  //         };
  //         return res.status(200).json({
  //           user,
  //           accessToken,
  //           success: true,
  //           message: 'Auth SuccessFul',
  //         });
  //       }
  //     });
  //   });
};

exports.user_sign_up = async (req, res, next) => {
  const { role, email, password } = req.body;
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
              role,
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

    if ((_id, email)) {
      const refreshToken = jwt.sign({ _id, email }, process.env.JWT_KEY, {
        expiresIn: '1h',
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

//Dev to

//get users
exports.user_get_users = async (req, res) => {
  const users = await User.find({})
    .populate({
      path: 'posts',
      populate: ['author', 'tags'],
    })
    .sort({ followers: -1 })
    .exec();
  if (!users) {
    return res.status(404).json({ message: 'No Users Found' });
  }
  res.status(200).json({
    users: users.map((user) => user.toObject({ getters: true })),
    message: 'Users Lists',
    success: true,
  });
};

//get user
exports.user_get_user = async (req, res) => {
  const userName = req.params.userName;
  if (!userName) {
    return res
      .status(400)
      .json({ message: 'User Name is required', failed: true });
  }
  const user = await User.findOne({ userName })
    .populate({
      path: 'posts',
      populate: ['author', 'tags'],
    })
    .exec();

  if (!user) {
    return res
      .status(204)
      .json({ message: `User ${userName} not found`, failed: true });
  }
  res.status(200).json({
    user: user.toObject({ getters: true }),
    message: 'User data',
    success: true,
  });
};

//get user dashboard
exports.user_get_user_dashboard = async (req, res) => {
  const userName = req.params.userName;

  if (!userName) {
    return res.status(400).json({ message: 'User Name is required' });
  }
  const user = await User.findOne({ userName })
    .populate({
      path: 'posts',
      options: { sort: { created: -1 } },
    })
    .populate('following')
    .populate('followers')
    .populate({ path: 'followedTags', options: { sort: { posts: -1 } } });

  if (!user) {
    return res.status(204).json({
      message: `User ${userName} not found`,
      failed: true,
    });
  }

  res.status(200).json({
    user: user.toObject({ getters: true }),
    message: 'User details',
    success: true,
  });
};

//delete user
exports.user.delete_user = async (req, res) => {
  const _id = req.params.id;

  if (!_id) {
    return res.status(400).json({ message: 'User Id required', failed: true });
  }

  const user = await User.findOne({ _id }).exec();

  if (!user) {
    return res
      .status(204)
      .json({ message: 'User Id is in valid', failed: true });
  }

  const deleteUser = await User.deleteOne({ _id });

  if (deleteUser) {
    return res
      .status(200)
      .json({ message: 'User deleted successfully', success: true });
  }

  //Cloudinary

  // followers and following

  // delete Post
};

//update user
exports.user.update_user = async (req, res) => {
  const _id = req.params.id;

  const user = await User.findOne({ _id }).exec();

  if (!user) {
    return res.status(400).json({
      message: 'User id is invalid',
      failed: true,
    });
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id },
    { ...req.body },
    { new: true }
  );
  if (updatedUser) {
    return res
      .status(200)
      .json({ message: 'User updated successfully', success: true });
  }
};
