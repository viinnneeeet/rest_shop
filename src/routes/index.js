const express = require('express');
const router = express.Router();
const presignedURLRoutes = require('./presignedURL.routes');
const galleryRoutes = require('./gallery.routes');
const eventRoutes = require('./events.routes');
const sevaRoutes = require('./seva.routes');
const sevaPaymentRoutes = require('./seva-payment.routes');
const authRoutes = require('./auth.routes');
const invoiceRoutes = require('./invoice.routes');

router.use('/presigned-url', presignedURLRoutes);
router.use('/gallery', galleryRoutes);
router.use('/events', eventRoutes);
router.use('/sevas', sevaRoutes);
router.use('/seva-payment', sevaPaymentRoutes);
router.use('/auth', authRoutes);
router.use('/invoice', invoiceRoutes);

module.exports = router;
