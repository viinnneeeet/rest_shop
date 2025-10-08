const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  paymentSuccess,
  paymentFailure,
} = require('../controllers/seva-payment.controller');

router.post('/initiate', initiatePayment);
router.post('/success', paymentSuccess);
router.post('/failure', paymentFailure);

module.exports = router;
