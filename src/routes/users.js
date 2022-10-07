const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

//Store

router.route('/registration').post(UserController.create_user);

router.route('/login').post(UserController.loginUser);

router.route('/logout').get(UserController.logoutUser);

router.route('/password/forgot').post(UserController.forgotPassword);

router.route('/password/reset/:token').post(UserController.resetPassword);

module.exports = router;
