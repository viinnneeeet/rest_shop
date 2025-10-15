const express = require('express');
const ContactUs = require('../controllers/contact-us.controller');
const router = express.Router();

router.post('/submit-request', ContactUs.createContactUs);
router.get('/get-contacts', ContactUs.getAllContactUsList);
router.post('/reply', ContactUs.replyContactUs);

module.exports = router;
