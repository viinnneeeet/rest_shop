const express = require('express');
const EventController = require('../controllers/events.controller');

const router = express.Router();

router.post('/create-event', EventController.createEvent);
router.get('/get-event', EventController.getAllEvents);
router.get('/get-event/:id', EventController.getEventById);
router.put('/update-event/:id', EventController.updateEvent);
router.delete('/delete-event/:id', EventController.deleteEvent);

module.exports = router;
