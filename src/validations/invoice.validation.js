// src/validations/sevaBooking.validation.js
const Joi = require('joi');

const sevaBookingSchema = Joi.object({
  user: Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      'string.empty': 'User name is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Valid email is required',
    }),
    phone: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({
        'string.pattern.base': 'Phone must be a valid 10-digit Indian number',
      }),
  }).required(),

  seva: Joi.object({
    title: Joi.string().min(3).max(150).required().messages({
      'string.empty': 'Seva title is required',
    }),
    description: Joi.string().allow('').max(500),
    amount: Joi.number().positive().required().messages({
      'number.base': 'Amount must be a valid number',
    }),
    date: Joi.date().iso().required().messages({
      'date.base': 'Seva date must be a valid date',
      'date.format': 'Date must be in YYYY-MM-DD format',
    }),
  }).required(),
});

module.exports = { sevaBookingSchema };
