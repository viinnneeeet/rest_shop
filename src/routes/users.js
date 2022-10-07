const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

//Store

router.route('/registration').post(UserController.create_user);
module.exports = router;
