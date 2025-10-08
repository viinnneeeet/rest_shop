const {
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} = require('../validations/auth.validation');
const AuthService = require('../services/auth.service');
const ResponseHandler = require('../utils/responseHandler');

async function login(req, res) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return ResponseHandler.badRequest(res, error.details[0].message);
    }

    const { email, password } = value;
    const result = await AuthService.login(email, password);

    if (!result) {
      return ResponseHandler.unauthorized(res, 'Invalid email or password');
    }

    return ResponseHandler.success(res, result, 'Login successful');
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

async function register(req, res) {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return ResponseHandler.badRequest(res, error.details[0].message);

    const user = await AuthService.register(
      value.name,
      value.email,
      value.password
    );
    if (!user) return ResponseHandler.badRequest(res, 'Email already exists');

    return ResponseHandler.success(
      res,
      user,
      'User registered successfully',
      201
    );
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

async function updatePassword(req, res) {
  try {
    const { error, value } = updatePasswordSchema.validate(req.body);
    if (error) return ResponseHandler.badRequest(res, error.details[0].message);

    const result = await AuthService.updatePassword(
      value.email,
      value.oldPassword,
      value.newPassword
    );
    if (!result)
      return ResponseHandler.unauthorized(res, 'Invalid email or old password');

    return ResponseHandler.success(
      res,
      result,
      'Password updated successfully'
    );
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

module.exports = { login, register, updatePassword };
