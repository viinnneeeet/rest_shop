const db = require('../db/models');
const { Op } = db.Sequelize;

/**
 * ✅ Create a new Seva
 */
async function createSeva(data) {
  try {
    const newSeva = await db.Sevas.create({
      title: data.title,
      description: data.description,
      amount: data.amount,
      duration: data.duration,
      benefits: data.benefits || [], // JSON array stored as Sequelize JSON type
      category: data.category,
      availability: data.availability ?? 'available',
      isActive: data.isActive ?? true,
    });

    return newSeva.get({ plain: true });
  } catch (err) {
    console.error('Error creating Seva:', err);
    throw new Error('Failed to create Seva');
  }
}

/**
 * ✅ Get all Sevas (with optional pagination + filters + search)
 */
async function getAllSevas({ page = 1, limit = 10, filters = {}, search }) {
  try {
    const offset = (page - 1) * limit;
    const where = {};

    // Apply dynamic filters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '') where[key] = value;
    }

    // Search across multiple fields
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await db.Sevas.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return {
      sevasList: rows,
      pagination: {
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        perPage: limit,
      },
    };
  } catch (err) {
    console.error('Error fetching Sevas:', err);
    throw new Error('Failed to fetch Sevas');
  }
}

/**
 * ✅ Get active Sevas only
 */
async function getActiveSevas() {
  try {
    const rows = await db.Sevas.findAll({
      where: { isActive: true },
      order: [['id', 'DESC']],
    });
    return rows.map((r) => r.get({ plain: true }));
  } catch (err) {
    console.error('Error fetching active Sevas:', err);
    throw new Error('Failed to fetch active Sevas');
  }
}

/**
 * ✅ Get Seva by ID
 */
async function getSevaById(id) {
  try {
    const seva = await db.Sevas.findByPk(id);
    return seva ? seva.get({ plain: true }) : null;
  } catch (err) {
    console.error('Error fetching Seva by ID:', err);
    throw new Error('Failed to fetch Seva');
  }
}

/**
 * ✅ Update Seva
 */
async function updateSeva(id, data) {
  try {
    // Ensure benefits is an array
    if (data.benefits && !Array.isArray(data.benefits)) {
      data.benefits = JSON.parse(data.benefits);
    }

    const [updatedRows] = await db.Sevas.update(
      {
        title: data.title,
        description: data.description,
        amount: data.amount,
        duration: data.duration,
        benefits: data.benefits,
        category: data.category,
        availability: data.availability,
        isActive: data.isActive,
      },
      { where: { id } }
    );

    if (updatedRows === 0) {
      throw new Error(`Seva with ID ${id} not found or unchanged`);
    }

    const updatedSeva = await db.Sevas.findByPk(id);
    return updatedSeva.get({ plain: true });
  } catch (err) {
    console.error('Error updating Seva:', err);
    throw new Error('Failed to update Seva');
  }
}

/**
 * ✅ Soft delete Seva
 */
async function deleteSeva(id) {
  try {
    const [updatedRows] = await db.Sevas.update(
      { isActive: false },
      { where: { id } }
    );

    if (updatedRows === 0) {
      throw new Error(`Seva with ID ${id} not found`);
    }

    return { message: `Seva ${id} deactivated successfully` };
  } catch (err) {
    console.error('Error deleting Seva:', err);
    throw new Error('Failed to delete Seva');
  }
}

module.exports = {
  createSeva,
  updateSeva,
  deleteSeva,
  getAllSevas,
  getActiveSevas,
  getSevaById,
};
