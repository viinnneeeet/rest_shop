const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserOtpSchema = new Schema({
  userId: {
    type: String,
    required: [true, 'Please Provide UserId'],
  },
  otp: {
    type: String,
    required: [true, 'Please Enter OTP'],
  },
  createdAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
  },
});
//Compare Otp

module.exports = mongoose.model('UserOtp', UserOtpSchema);

UserOtpSchema.methods.compareOtp = async function (enteredOTP) {
  return await bcrypt.compare(enteredOTP, this.password);
};
