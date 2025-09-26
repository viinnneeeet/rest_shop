const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { uploadImage } = require('../utils/upload');
//Store

router
  .route('/update/password')
  .post(isAuthenticatedUser, UserController.updateUserPassword);

router
  .route('/update')
  .post(
    isAuthenticatedUser,
    uploadImage('image', 'users'),
    UserController.updateUserProfile
  );

//shipping address

router.route('/').get(isAuthenticatedUser, UserController.getUserDetails);

module.exports = router;
