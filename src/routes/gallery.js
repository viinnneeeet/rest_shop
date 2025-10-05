const express = require('express');
const GalleryController = require('../controllers/gallery.controller');

const router = express.Router();

// ✅ Create a new gallery item
router.post('/create-gallery', GalleryController.createGallery);

// ✅ Get all active gallery items
router.get('/get-gallery', GalleryController.getAllGallery);

// ✅ Get gallery item by ID
router.get('/get-gallery/:id', GalleryController.getGalleryById);

// ✅ Update a gallery item by ID
router.post('/update-gallery', GalleryController.updateGallery);

// ✅ Soft delete a gallery item (set isActive = false)
router.delete('/delete-gallery/:id', GalleryController.deleteGallery);

module.exports = router;
