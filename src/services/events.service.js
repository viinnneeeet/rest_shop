const db = require('../db/models');

async function createEvent(data) {
  try {
    const newEvent = await db.Events.create({
      date: data.date,
      title: data.title,
      type: data.type,
      time: data.time,
      location: data.location,
      description: data.description,
      isActive: data.isActive ?? true,
      image_url: data.image_url,
      participants: data.participants,
      status: data.status,
    });

    return newEvent.get({ plain: true });
  } catch (err) {
    console.error('Error creating event:', err);
    throw new Error('Failed to create event');
  }
}

async function getAllEvents({ page = 1, limit = 10, filters = {}, search }) {
  try {
    const offset = (page - 1) * limit;
    const where = { isActive: true };
    const { Op } = db.Sequelize;

    // Apply dynamic filters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '') where[key] = value;
    }

    // Add search if applicable
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { type: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await db.Events.findAndCountAll({
      where,
      limit,
      offset,
      order: [['date', 'DESC']],
    });

    return {
      eventsList: rows,
      pagination: {
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        perPage: limit,
      },
    };
  } catch (err) {
    console.error('Error fetching events:', err);
    throw new Error('Failed to fetch events');
  }
}

/**
 * ✅ Get a single event by ID
 */
async function getEventById(id) {
  try {
    const event = await db.Events.findByPk(id);
    return event ? event.get({ plain: true }) : null;
  } catch (err) {
    console.error('Error fetching event by ID:', err);
    throw new Error('Failed to fetch event');
  }
}

/**
 * ✅ Update event by ID
 */
async function updateEvent(id, data) {
  try {
    const [updatedRows] = await db.Events.update(
      {
        date: data.date,
        title: data.title,
        type: data.type,
        time: data.time,
        location: data.location,
        description: data.description,
        isActive: data.isActive,
        image_url: data.image_url,
        participants: data.participants,
        status: data.status,
      },
      { where: { id } }
    );

    if (updatedRows === 0) {
      throw new Error(`Event with ID ${id} not found or unchanged`);
    }

    const updatedEvent = await db.Events.findByPk(id);
    return updatedEvent.get({ plain: true });
  } catch (err) {
    console.error('Error updating event:', err);
    throw new Error('Failed to update event');
  }
}

/**
 * ✅ Soft delete (deactivate)
 */
async function deleteEvent(id) {
  try {
    const [updatedRows] = await db.Events.update(
      { isActive: false },
      { where: { id } }
    );

    if (updatedRows === 0) {
      throw new Error(`Event with ID ${id} not found`);
    }

    return { message: `Event ${id} deactivated successfully` };
  } catch (err) {
    console.error('Error deleting event:', err);
    throw new Error('Failed to delete event');
  }
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
