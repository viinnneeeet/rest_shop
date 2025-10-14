const express = require('express');
const ContactUs = require('../controllers/contact-us.controller');
const router = express.Router();

router.post('/submit-request', ContactUs.createContactUs);
router.get('/get-contacts', ContactUs.getAllContactUsList);

module.exports = router;
