// const { JWT } = require('google-auth-library');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
//Dev to model
// const UserSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     userName: { type: String, required: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       match:
//         /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
//     },
//     password: { type: String, required: true },
//     role: { type: String, default: 'User' },
//     bio: { type: String, default: '' },
//     location: { type: String, default: '' },
//     education: { type: String, default: '' },
//     work: { type: String, default: '' },
//     availableFor: { type: String, default: '' },
//     skills: { type: String, default: '' },
//     posts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
//     comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
//     followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
//     refreshToken: { type: String, default: '' },
//   },
//   {
//     timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
//   }
// );

//Store
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter name'],
      minLength: [3, 'Please enter a name at least 3 character'],
      maxLength: [15, 'Name cannot be big than 15 character'],
    },
    email: {
      type: String,
      required: [true, 'Please enter the email'],
      validate: [validator.isEmail, 'Please enter a valid email'],
      unique: true,
    },
    phoneNo: {
      type: String,
      required: [true, 'Please enter phone number'],
      validate: [validator.isMobilePhone, 'Please enter a valid mobile number'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter password'],
      minLength: [8, 'Please enter a name at least 8 character'],
      select: false,
    },
    avatar: {
      _id: {
        type: mongoose.Schema.ObjectId,
      },
      url: {
        type: String,
      },
    },
    // avatar: {
    //   type: String,
    // },
    role: {
      type: String,
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

//Hash Password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//Compare Password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Forget Password
UserSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  //hashing and adding reset Password to user schema
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordTime = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

//Jwt Token
// process.env.JWT_KEY
UserSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_KEY, {
    expiresIn: '30m',
  });
};

module.exports = mongoose.model('User', UserSchema);
