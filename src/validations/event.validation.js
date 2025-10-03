const Joi = require('joi');

const createEventSchema = Joi.object({
  date: Joi.date().required().messages({
    'any.required': 'Date is required',
    'date.base': 'Date must be a valid date',
  }),
  title: Joi.string().max(100).required().messages({
    'any.required': 'Title is required',
    'string.max': 'Title cannot exceed 100 characters',
  }),
  type: Joi.string().max(50).required().messages({
    'any.required': 'Type is required',
    'string.max': 'Type cannot exceed 50 characters',
  }),
  time: Joi.string().max(50).required().messages({
    'any.required': 'Time is required',
    'string.max': 'Time cannot exceed 50 characters',
  }),
  location: Joi.string().max(100).required().messages({
    'any.required': 'Location is required',
    'string.max': 'Location cannot exceed 100 characters',
  }),
  attendees: Joi.number().integer().min(0).required().messages({
    'any.required': 'Attendees count is required',
    'number.base': 'Attendees must be a number',
    'number.min': 'Attendees cannot be negative',
  }),
  description: Joi.string().max(255).allow(null, '').messages({
    'string.max': 'Description cannot exceed 255 characters',
  }),
  isActive: Joi.boolean().default(true),
});

const updateEventSchema = Joi.object({
  date: Joi.date().optional(),
  title: Joi.string().max(100).optional(),
  type: Joi.string().max(50).optional(),
  time: Joi.string().max(50).optional(),
  location: Joi.string().max(100).optional(),
  attendees: Joi.number().integer().min(0).optional(),
  description: Joi.string().max(255).allow(null, '').optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  createEventSchema,
  updateEventSchema,
};
