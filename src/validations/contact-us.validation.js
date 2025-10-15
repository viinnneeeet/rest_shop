const Joi = require('joi');

const baseContactUsSchema = Joi.object({
  id: Joi.number().integer().positive().messages({
    'number.base': 'ID must be a number',
    'number.positive': 'ID must be a positive number',
  }),
  firstName: Joi.string().trim().max(100).messages({
    'string.base': 'First name must be string',
    'string.max': 'First name cannot exceed 100 characters',
  }),
  lastName: Joi.string().trim().max(100).messages({
    'string.base': 'Last name must be string',
    'string.max': 'Last name cannot exceed 100 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Valid email is required',
  }),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .messages({
      'string.pattern.base': 'Phone must be a valid 10-digit Indian number',
    }),
  messages: Joi.string().trim().max(500).messages({
    'string.base': 'Description must be a string',
    'string.max': 'Description cannot exceed 500 characters',
  }),
});

const contactUsSchema = baseContactUsSchema.fork(
  ['firstName', 'lastName', 'email', 'messages'],
  (field) => field.required()
);

const replySchema = Joi.object({
  contactId: Joi.number().integer().required().messages({
    'any.required': 'Contact ID is required',
    'number.base': 'Contact ID must be a valid number',
  }),
  response: Joi.string().min(3).required().messages({
    'string.empty': 'Reply message cannot be empty',
    'string.min': 'Reply message must be at least 3 characters long',
  }),
});

module.exports = {
  contactUsSchema,
  replySchema,
};
