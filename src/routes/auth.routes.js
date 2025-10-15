const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/update-password', AuthController.updatePassword);
router.post(
  '/update-temp-password',
  authenticate,
  AuthController.updateTempPassword
);

module.exports = router;
