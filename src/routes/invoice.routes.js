const express = require('express');
const {
  createInvoice,
  getAllInvoices,
} = require('../controllers/invoice.controller');
const authenticate = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/genrate-invoice', createInvoice);
router.get('/get-invoices', authenticate, getAllInvoices);

module.exports = router;
