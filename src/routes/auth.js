const express = require('express');
const router = express.Router();
const SignInController = require('../controllers/sign.in.controller');

//Store
router.route('/').post(SignInController?.authUser);

router.route('/verifyOtp').post(SignInController?.verifyOtp);

router.route('/registration').post(SignInController?.create_user);

router.route('/login').post(SignInController?.loginUser);

router.route('/logout').get(SignInController.logoutUser);

router.route('/password/forgot').post(SignInController.forgotPassword);

router.route('/password/reset/:token').put(SignInController.resetPassword);

module.exports = router;
