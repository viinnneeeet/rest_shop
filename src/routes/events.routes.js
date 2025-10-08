const express = require('express');
const EventController = require('../controllers/events.controller');
const authenticate = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/create-event', authenticate, EventController.createEvent);
router.get('/get-event', EventController.getAllEvents);
router.get('/get-event/:id', EventController.getEventById);
router.post('/update-event', authenticate, EventController.updateEvent);
router.post('/delete-event/:id', authenticate, EventController.deleteEvent);

module.exports = router;
