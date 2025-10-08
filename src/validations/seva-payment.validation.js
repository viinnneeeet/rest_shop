const Joi = require('joi');

/**
 * ✅ Base reusable validators
 */
const txnidSchema = Joi.string()
  .pattern(/^txn_\d+$/)
  .messages({
    'string.pattern.base': 'Invalid transaction ID format',
  });

const initiatePaymentSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name cannot exceed 100 characters',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Phone number must be a valid 10-digit Indian number',
      'any.required': 'Phone number is required',
    }),

  amount: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be greater than zero',
    'any.required': 'Amount is required',
  }),

  sevaName: Joi.string().trim().min(3).max(150).required().messages({
    'string.empty': 'Seva name is required',
    'string.min': 'Seva name must be at least 3 characters',
    'string.max': 'Seva name cannot exceed 150 characters',
  }),
});

const updatePaymentStatusSchema = Joi.object({
  txnid: txnidSchema.required().messages({
    'any.required': 'Transaction ID is required',
  }),

  status: Joi.string()
    .valid('pending', 'success', 'failed')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, success, failed',
      'any.required': 'Status is required',
    }),

  payuResponse: Joi.object().unknown(true).messages({
    'object.base': 'PayU response must be an object',
  }),
});

/**
 * ✅ Schema for fetching a payment by txnid
 */
const getPaymentByTxnIdSchema = Joi.object({
  txnid: txnidSchema.required(),
});

module.exports = {
  initiatePaymentSchema,
  updatePaymentStatusSchema,
  getPaymentByTxnIdSchema,
};
