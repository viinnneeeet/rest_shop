const Joi = require('joi');

// Base schema — defines the shape and constraints of an Event
const baseEventSchema = Joi.object({
  id: Joi.number().integer().positive().messages({
    'number.base': 'ID must be a number',
    'number.positive': 'ID must be a positive number',
  }),

  title: Joi.string().trim().max(100).messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title cannot be empty',
    'string.max': 'Title cannot exceed 100 characters',
  }),

  type: Joi.string().trim().max(50).messages({
    'string.base': 'Type must be a string',
    'string.empty': 'Type cannot be empty',
    'string.max': 'Type cannot exceed 50 characters',
  }),

  location: Joi.string().trim().max(100).messages({
    'string.base': 'Location must be a string',
    'string.empty': 'Location cannot be empty',
    'string.max': 'Location cannot exceed 100 characters',
  }),

  description: Joi.string().trim().max(255).allow(null, '').messages({
    'string.base': 'Description must be a string',
    'string.max': 'Description cannot exceed 255 characters',
  }),

  date: Joi.date().messages({
    'date.base': 'Date must be a valid date',
  }),

  time: Joi.string().trim().max(50).messages({
    'string.base': 'Time must be a string',
    'string.empty': 'Time cannot be empty',
    'string.max': 'Time cannot exceed 50 characters',
  }),

  isActive: Joi.boolean().default(true).messages({
    'boolean.base': 'isActive must be a boolean value',
  }),

  image_url: Joi.string().uri().messages({
    'string.uri': 'Image URL must be a valid URI',
    'string.empty': 'Image URL cannot be empty',
  }),

  participants: Joi.number().integer().min(0).messages({
    'number.base': 'Participants must be a number',
    'number.min': 'Participants cannot be negative',
  }),

  status: Joi.string()
    .trim()
    .valid('pending', 'active', 'completed', 'cancelled', 'upcoming')
    .messages({
      'any.only':
        'Status must be one of: pending, active, completed, cancelled, upcoming',
    }),
});

// Create schema — all required except id (auto-increment)
const createEventSchema = baseEventSchema.fork(
  [
    'title',
    'type',
    'location',
    'description',
    'date',
    'time',
    'isActive',
    'image_url',
    'participants',
    'status',
  ],
  (field) => field.required()
);

// Update schema — all optional
const updateEventSchema = baseEventSchema.unknown(false);

module.exports = {
  createEventSchema,
  updateEventSchema,
};
