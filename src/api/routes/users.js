const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

//Signup
router.post('/signup', UserController.user_sign_up);
//SignIn
router.post('/login', UserController.user_sign_in);
//Delete User
router.post('/deleteUser', UserController.user_delete);
//Refresh Token
router.post('/refreshToken', UserController.user_refresh_token);

module.exports = router;
