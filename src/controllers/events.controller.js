const EventService = require('../services/events.service');
const ResponseHandler = require('../utils/responseHandler');
const {
  createEventSchema,
  updateEventSchema,
} = require('../validations/event.validation');

async function createEvent(req, res) {
  try {
    const { error, value } = createEventSchema.validate(req.body);
    if (error) return ResponseHandler.badRequest(res, error.details[0].message);

    const event = await EventService.createEvent(value);
    return ResponseHandler.success(
      res,
      event,
      'Event created successfully',
      201
    );
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

async function getAllEvents(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { category, search, isActive } = req.query;
    const filters = { category, isActive };
    const { eventsList, pagination } = await EventService.getAllEvents({
      page,
      limit,
      filters,
      search,
    });
    return ResponseHandler.success(
      res,
      { eventsList, pagination },
      'Events fetched successfully'
    );
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const event = await EventService.getEventById(id);
    if (!event) return ResponseHandler.notFound(res, 'Event not found');

    return ResponseHandler.success(res, event, 'Event fetched successfully');
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

async function updateEvent(req, res) {
  try {
    const { id } = req.body;
    const updatedData = req.body;
    const { error, value } = updateEventSchema.validate(updatedData);
    if (error) return ResponseHandler.badRequest(res, error.details[0].message);
    const event = await EventService.updateEvent(id, value);
    if (!event) return ResponseHandler.notFound(res, 'Event not found');

    return ResponseHandler.success(res, event, 'Event updated successfully');
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

async function deleteEvent(req, res) {
  try {
    const { id } = req.params;

    const event = await EventService.getEventById(id);
    if (!event) return ResponseHandler.notFound(res, 'Event not found');

    const result = await EventService.deleteEvent(id);
    return ResponseHandler.success(res, result, 'Event deleted (soft delete)');
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
