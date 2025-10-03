const express = require('express');
const GalleryController = require('../controllers/gallery.controller');

const router = express.Router();

// ✅ Create a new gallery item
router.post('/', GalleryController.createGallery);

// ✅ Get all active gallery items
router.get('/', GalleryController.getAllGallery);

// ✅ Get gallery item by ID
router.get('/:id', GalleryController.getGalleryById);

// ✅ Update a gallery item by ID
router.put('/:id', GalleryController.updateGallery);

// ✅ Soft delete a gallery item (set isActive = false)
router.delete('/:id', GalleryController.deleteGallery);

module.exports = router;
