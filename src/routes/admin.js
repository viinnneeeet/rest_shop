const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router
  .route('/users')
  .get(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    UserController.getAllUsers
  );

router
  .route('/user/:_id')
  .get(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    UserController.getSingleUser
  )
  .put(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    UserController.updateUserRole
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    UserController.deleteUser
  );

module.exports = router;
