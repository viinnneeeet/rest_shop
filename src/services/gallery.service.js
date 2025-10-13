const db = require('../db/models');

/**
 * ✅ Create a new gallery item
 */
async function createGallery(data) {
  try {
    const newGallery = await db.Gallery.create({
      image_url: data.image_url,
      title: data.title,
      category: data.category,
      description: data.description,
      isActive: data.isActive ?? true,
    });

    return newGallery.get({ plain: true });
  } catch (err) {
    console.error('Error creating gallery:', err);
    throw new Error('Failed to create gallery');
  }
}

/**
 * ✅ Get all gallery items (with optional pagination and filters)
 */
async function getAllGallery({ page = 1, limit = 10, filters = {}, search }) {
  try {
    const offset = (page - 1) * limit;
    const where = { isActive: true };

    // Apply filters dynamically
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '') where[key] = value;
    }

    // Apply search (if any)
    if (search) {
      const { Op } = db.Sequelize;
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await db.Gallery.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      galleryList: rows,
      pagination: {
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        perPage: limit,
      },
    };
  } catch (err) {
    console.error('Error fetching gallery list:', err);
    throw new Error('Failed to fetch gallery list');
  }
}

/**
 * ✅ Get a gallery item by ID
 */
async function getGalleryById(id) {
  try {
    const gallery = await db.Gallery.findByPk(id);
    return gallery ? gallery.get({ plain: true }) : null;
  } catch (err) {
    console.error('Error fetching gallery by ID:', err);
    throw new Error('Failed to fetch gallery item');
  }
}

/**
 * ✅ Update a gallery item
 */
async function updateGallery(id, data) {
  try {
    const [updatedRows] = await db.Gallery.update(
      {
        title: data.title,
        category: data.category,
        description: data.description,
        isActive: data.isActive,
        image_url: data.image_url,
      },
      { where: { id } }
    );

    if (updatedRows === 0) {
      throw new Error(`Gallery with ID ${id} not found or unchanged`);
    }

    const updated = await db.Gallery.findByPk(id);
    return updated.get({ plain: true });
  } catch (err) {
    console.error('Error updating gallery:', err);
    throw new Error('Failed to update gallery');
  }
}

/**
 * ✅ Soft delete (deactivate)
 */
async function deleteGallery(id) {
  try {
    const [updatedRows] = await db.Gallery.update(
      { isActive: false },
      { where: { id } }
    );

    if (updatedRows === 0) {
      throw new Error(`Gallery with ID ${id} not found`);
    }

    return { message: `Gallery item ${id} deactivated successfully` };
  } catch (err) {
    console.error('Error deleting gallery:', err);
    throw new Error('Failed to delete gallery');
  }
}

module.exports = {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
};
