const Joi = require('joi');

const createGallerySchema = Joi.object({
  src: Joi.string().uri().required(),
  title: Joi.string().min(3).max(100).required(),
  category: Joi.string().min(3).max(50).required(),
  description: Joi.string().max(255).optional(),
  isActive: Joi.boolean().default(true),
});

module.exports = { createGallerySchema };
