const express = require('express');
const ContactUs = require('../controllers/contact-us.controller');
const authenticate = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/submit-request', ContactUs.createContactUs);
router.get('/get-contacts', authenticate, ContactUs.getAllContactUsList);
router.post('/reply', authenticate, ContactUs.replyContactUs);

module.exports = router;
