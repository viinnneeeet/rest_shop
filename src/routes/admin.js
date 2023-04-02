const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router
  .route('/createUser')
  .post(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    AdminController.createUser
  );

router
  .route('/getAllUsers')
  .get(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    AdminController.getAllUsers
  );

router
  .route('/user/:_id')
  .get(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    AdminController.getSingleUser
  )
  .put(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    AdminController.updateUserRole
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    AdminController.deleteUser
  );

module.exports = router;
