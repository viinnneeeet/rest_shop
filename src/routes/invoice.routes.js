const express = require('express');
const {
  createInvoice,
  getAllInvoices,
} = require('../controllers/invoice.controller');

const router = express.Router();

router.post('/genrate-invoice', createInvoice);
router.get('/get-invoices', getAllInvoices);

module.exports = router;
