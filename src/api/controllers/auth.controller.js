const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const axios = require('axios');
const { json } = require('body-parser');

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Enter Email And Password', failed: true });
  }
  try {
    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser) {
      return res.status(401).json({ message: 'Email is in valid' });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      const token = jwt.sign(
        { userName: foundUser.userName },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' }
      );
      const refreshToken = jwt.sign(
        { userName: foundUser.userName },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '10m' }
      );
      res.cookie('jwt', refreshToken, {
        httpOny: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
      });

      foundUser.refreshToken = refreshToken;
      await foundUser.save();
      res.status(200).json({
        ...foundUser.toObject({ getters: true }),
        token,
        success: true,
      });
    } else {
      return (
        res.status(401), json({ message: 'In Correct Password', failed: true })
      );
    }
  } catch (err) {
    return res.status(500).json({ message: err.message, failed: true });
  }
};

const handleGoogleLogin = async (req, res) => {
  const { tokenId } = req.body;

  const response = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { name, email, picture } = response.getPayload();
  let existingUser;

  existingUser = await User.findOne({ email }, '-password').exec();

  if (!existingUser) {
    const userName = email.slice(0, email.indexOf('@'));
    try {
      const hashedPwd = await bcrypt.hash(email + userName + email, 10);

      existingUser = await User.create({
        userName,
        email,
        password: hashedPwd,
        picture: {
          url: picture,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message, failed: true });
    }
  }
};

module.exports = { handleLogin };
