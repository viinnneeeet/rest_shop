const GalleryService = require('../services/gallery.service');
const {
  createGallerySchema,
  updateGallerySchema,
} = require('../validations/gallery.validation');
const ResponseHandler = require('../utils/responseHandler');

async function createGallery(req, res) {
  try {
    const { error, value } = createGallerySchema.validate(req.body);
    if (error) {
      return ResponseHandler.badRequest(res, error.details[0].message);
    }

    const gallery = await GalleryService.createGallery(value);
    return ResponseHandler.success(
      res,
      gallery,
      'Gallery item created successfully',
      201
    );
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

async function getAllGallery(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { category, search, isActive } = req.query;
    const filters = { category };
    const { galleryList, pagination } = await GalleryService.getAllGallery({
      page,
      limit,
      filters,
      search,
      isActive,
    });

    return ResponseHandler.success(
      res,
      { galleryList, pagination },
      'Gallery list fetched successfully'
    );
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

async function getGalleryById(req, res) {
  try {
    const { id } = req.params;
    const gallery = await GalleryService.getGalleryById(id);

    if (!gallery) {
      return ResponseHandler.notFound(res, 'Gallery item not found');
    }

    return ResponseHandler.success(
      res,
      gallery,
      'Gallery item fetched successfully'
    );
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

async function updateGallery(req, res) {
  try {
    const { id } = req.body;
    const updatedData = req.body;
    const { error, value } = updateGallerySchema.validate(updatedData);
    if (error) {
      return ResponseHandler.badRequest(res, error.details[0].message);
    }
    const gallery = await GalleryService.updateGallery(id, value);

    if (!gallery) {
      return ResponseHandler.notFound(res, 'Gallery item not found');
    }

    return ResponseHandler.success(
      res,
      gallery,
      'Gallery item updated successfully'
    );
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

async function deleteGallery(req, res) {
  try {
    const { id } = req.params;

    const gallery = await GalleryService.getGalleryById(id);
    if (!gallery) {
      return ResponseHandler.notFound(res, 'Gallery item not found');
    }

    const result = await GalleryService.deleteGallery(id);
    return ResponseHandler.success(
      res,
      result,
      'Gallery item deleted (soft delete)'
    );
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

module.exports = {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
};
