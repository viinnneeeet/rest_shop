// create token and saving that in cookies
const sendToken = (user, statusCode, res, message) => {
  const token = user.getJwtToken();

  // Options for cookies
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // const otp = sendOTPVerificationEmail(user._id, user.email, res);

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
    token,
    message,
  });
};

module.exports = sendToken;
