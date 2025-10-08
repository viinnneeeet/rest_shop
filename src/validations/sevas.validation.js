const Joi = require('joi');

const baseSevaSchema = Joi.object({
  title: Joi.string().max(100).required().messages({
    'any.required': 'Title is required',
    'string.max': 'Title cannot exceed 100 characters',
  }),

  description: Joi.string().max(255).required().messages({
    'any.required': 'Description is required',
    'string.max': 'Description cannot exceed 255 characters',
  }),

  amount: Joi.string().max(50).required().messages({
    'any.required': 'Amount is required',
    'string.max': 'Amount cannot exceed 50 characters',
  }),

  duration: Joi.string().max(50).required().messages({
    'any.required': 'Duration is required',
    'string.max': 'Duration cannot exceed 50 characters',
  }),

  benefits: Joi.array()
    .items(Joi.string().max(100))
    .min(1)
    .required()
    .messages({
      'any.required': 'At least one benefit is required',
      'array.min': 'Provide at least one benefit',
      'string.max': 'Each benefit cannot exceed 100 characters',
    }),

  category: Joi.string().max(50).required().messages({
    'any.required': 'Category is required',
    'string.max': 'Category cannot exceed 50 characters',
  }),

  availability: Joi.string()
    .valid('available', 'unavailable', 'upcoming')
    .default('available'),

  isActive: Joi.boolean().default(true),
});

// Create schema — all required
const createSevaSchema = baseSevaSchema.fork(
  [
    'title',
    'description',
    'amount',
    'duration',
    'benefits',
    'category',
    'availability',
    'isActive',
  ],
  (field) => field.required()
);

// Update schema — all optional
const updateSevaSchema = baseSevaSchema
  .fork(
    [
      'title',
      'description',
      'amount',
      'duration',
      'benefits',
      'category',
      'availability',
      'isActive',
    ],
    (field) => field.optional()
  )
  .unknown(true); // no extra fields

module.exports = { createSevaSchema, updateSevaSchema };
