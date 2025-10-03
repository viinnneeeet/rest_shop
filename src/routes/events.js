const express = require('express');
const EventController = require('../controllers/events.controller');

const router = express.Router();

router.post('/', EventController.createEvent);
router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);
router.put('/:id', EventController.updateEvent);
router.delete('/:id', EventController.deleteEvent);

module.exports = router;
