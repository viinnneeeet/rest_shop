const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { isAuthenticatedUser } = require('../middlewares/auth');
//Store

router
  .route('/update/password')
  .post(isAuthenticatedUser, UserController.updateUserPassword);

router
  .route('/update')
  .post(isAuthenticatedUser, UserController.updateUserProfile);

//shipping address

router.route('/').get(isAuthenticatedUser, UserController.getUserDetails);

module.exports = router;
