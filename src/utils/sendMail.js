const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const UserOtp = require('../models/user.otp.model');

let transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  auth: {
    user: 'lottie80@ethereal.email',
    pass: 'SnSgJcTnG9wE5HChh4',
  },
});
// verify connection configuration

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

const sendOTPVerificationEmail = catchAsyncErrors(
  async (_id, email, res, options) => {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    //mail options
    const mailOptions = {
      form: 'lottie80@ethereal.email',
      to: email,
      subject: 'Verify Email',
      html: `<p>Enter ${otp} in the app to verify your email address and complete the signup </p>
    <p>This code <b>expires in 2 mins</b></p>`,
      text: `Enter ${otp} in the aoo to verify your email address and complete the signup`,
    };
    //hash the otp
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    const newOtpVerify = new UserOtp({
      userId: _id,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 120000,
    });
    await newOtpVerify.save();
    transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: 'Otp sent',
      otp,
    });
  }
);

module.exports = sendOTPVerificationEmail;
