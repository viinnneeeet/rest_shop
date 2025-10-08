const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { secret, expiresIn } = require('../config/jwt');
const User = require('../db/models/user.model');

async function login(email, password) {
  const user = await User.findByEmail(email);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  const token = jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

async function register(name, email, password) {
  // Check if email exists
  const existing = await User.findByEmail(email);
  if (existing) return null;

  const user = await User.create({ name, email, password });
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function updatePassword(email, oldPassword, newPassword) {
  const user = await User.findByEmail(email);
  if (!user) return null;

  const valid = await user.validatePassword(oldPassword);
  if (!valid) return null;

  user.password = newPassword;
  await user.save();

  return { message: 'Password updated successfully' };
}

module.exports = { login, register, updatePassword };
