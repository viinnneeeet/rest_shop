const sequelize = require('../config/mysqlDb');
const queries = require('../db/queries/gallery.queries');

// ✅ Create
async function createGallery(data) {
  const { src, title, category, description, isActive = true } = data;
  const [result] = await sequelize.query(queries.INSERT_GALLERY, {
    replacements: { src, title, category, description, isActive },
  });
  return result;
}

// ✅ Get All
async function getAllGallery() {
  const [results] = await sequelize.query(queries.SELECT_ALL_GALLERY);
  return results;
}

// ✅ Get by ID
async function getGalleryById(id) {
  const [results] = await sequelize.query(queries.SELECT_GALLERY_BY_ID, {
    replacements: { id },
  });
  return results.length > 0 ? results[0] : null;
}

// ✅ Update
async function updateGallery(id, data) {
  const { title, category, description, isActive } = data;
  await sequelize.query(queries.UPDATE_GALLERY, {
    replacements: { id, title, category, description, isActive },
  });
  return await getGalleryById(id);
}

// ✅ Soft Delete
async function deleteGallery(id) {
  await sequelize.query(queries.DELETE_GALLERY, {
    replacements: { id },
  });
  return { message: `Gallery item ${id} deactivated` };
}

module.exports = {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
};
