const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const DashboardController = require('../controllers/dashboard.controller');

router.post('/get-counts', DashboardController.getDashboardCounts);

module.exports = router;
