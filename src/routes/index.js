const express = require('express');
const router = express.Router();
const presignedURLRoutes = require('./presignedURL');
const galleryRoutes = require('./gallery');
const eventRoutes = require('./events');
const sevaRoutes = require('./seva');

router.use('/presigned-url', presignedURLRoutes);
router.use('/gallery', galleryRoutes);
router.use('/events', eventRoutes);
router.use('/sevas', sevaRoutes);
module.exports = router;
