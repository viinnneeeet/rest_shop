const Joi = require('joi');

// Base schema — shared between create and update
const baseGallerySchema = Joi.object({
  image_url: Joi.string().uri().messages({
    'string.uri': 'Image URL must be a valid URI',
    'string.empty': 'Image URL cannot be empty',
  }),

  title: Joi.string().trim().min(3).max(100).messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 100 characters',
  }),

  category: Joi.string().trim().min(3).max(50).messages({
    'string.base': 'Category must be a string',
    'string.empty': 'Category cannot be empty',
    'string.min': 'Category must be at least 3 characters long',
    'string.max': 'Category cannot exceed 50 characters',
  }),

  description: Joi.string().trim().max(255).allow(null, '').messages({
    'string.base': 'Description must be a string',
    'string.max': 'Description cannot exceed 255 characters',
  }),

  isActive: Joi.boolean().default(true).messages({
    'boolean.base': 'isActive must be a boolean value',
  }),
});

// Create schema — all required fields
const createGallerySchema = baseGallerySchema.fork(
  ['image_url', 'title', 'category'],
  (field) => field.required()
);

// Update schema — all optional fields
const updateGallerySchema = baseGallerySchema
  .fork(
    ['image_url', 'title', 'category', 'description', 'isActive'],
    (field) => field.optional()
  )
  .unknown(true); // no extra fields allowed

module.exports = {
  createGallerySchema,
  updateGallerySchema,
};
