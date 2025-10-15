const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../controllers/presigned-url.controller');
const authenticate = require('../middlewares/auth.middleware');

// Multer setup (memory storage since we're streaming to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route
router.post('/', authenticate, upload.single('file'), uploadImage);

module.exports = router;
