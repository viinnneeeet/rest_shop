const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../controllers/gallery.controller');

// Multer setup (memory storage since we're streaming to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route
router.post('/upload', upload.single('file'), uploadImage);

// Delete route
router.delete('/delete/:publicId', deleteImage);

module.exports = router;
