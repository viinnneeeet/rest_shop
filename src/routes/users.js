const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
//Store

router.route('/registration').post(UserController.create_user);

router.route('/login').post(UserController.loginUser);

router.route('/logout').get(UserController.logoutUser);

router.route('/password/forgot').post(UserController.forgotPassword);

router.route('/password/reset/:token').put(UserController.resetPassword);

router
  .route('/me/update/password')
  .post(isAuthenticatedUser, UserController.updateUserPassword);

router
  .route('/me/update/profile')
  .post(isAuthenticatedUser, UserController.updateUserProfile);

router.route('/me').get(isAuthenticatedUser, UserController.getUserDetails);

router
  .route('/admin/users')
  .get(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    UserController.getAllUsers
  );

router
  .route('/admin/user/:_id')
  .get(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    UserController.getSingleUser
  );

module.exports = router;
