const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { name, userName, email, password, picture, role } = req.body;
  let url, publicId;

  if (!name || !userName || !email || !password || !role) {
    return res.status(400).json({ message: 'Something is missing' });
  }

  if (!picture) {
    url = '';
    publicId = '';
  }

  const duplicateUser = await User.findOne({ userName }).exec();
  if (duplicateUser) {
    return res.sendStatus(409).json({
      message: 'Username already taken',
      failed: true,
    });
  }
  const duplicateEmail = await User.findOne({ email }).exec();
  if (duplicateEmail) {
    return res.sendStatus(409).json({
      message: 'Email already Exists',
      failed: true,
    });
  }

  try {
    const hashedPwd = await bcrypt.hash(password, 10);

    await User.create({
      name,
      userName,
      email,
      password: hashedPwd,
      role,
    });

    res.status(201).json({
      message: `New user name ${userName} was created!`,
      success: true,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = { handleNewUser };
