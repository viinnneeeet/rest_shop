const sequelize = require('../config/mysqlDb');
const queries = require('../db/queries/events.queries');

// Create event
async function createEvent(data) {
  const {
    date,
    title,
    type,
    time,
    location,
    attendees,
    description,
    isActive = true,
  } = data;
  const [result] = await sequelize.query(queries.INSERT_EVENT, {
    replacements: {
      date,
      title,
      type,
      time,
      location,
      attendees,
      description,
      isActive,
    },
  });
  return result;
}

// Get all events
async function getAllEvents() {
  const [results] = await sequelize.query(queries.SELECT_ALL_EVENTS);
  return results;
}

// Get event by ID
async function getEventById(id) {
  const [results] = await sequelize.query(queries.SELECT_EVENT_BY_ID, {
    replacements: { id },
  });
  return results.length > 0 ? results[0] : null;
}

// Update event
async function updateEvent(id, data) {
  const {
    date,
    title,
    type,
    time,
    location,
    attendees,
    description,
    isActive,
  } = data;
  await sequelize.query(queries.UPDATE_EVENT, {
    replacements: {
      id,
      date,
      title,
      type,
      time,
      location,
      attendees,
      description,
      isActive,
    },
  });
  return await getEventById(id);
}

// Soft delete event
async function deleteEvent(id) {
  await sequelize.query(queries.DELETE_EVENT, { replacements: { id } });
  return { message: `Event ${id} deactivated` };
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
