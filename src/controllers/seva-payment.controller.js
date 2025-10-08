const PaymentService = require('../services/seva-payment.service');
const ResponseHandler = require('../utils/responseHandler');
const {
  initiatePaymentSchema,
} = require('../validations/seva-payment.validation'); // optional Joi validation

/**
 * Initiate payment
 */
async function initiatePayment(req, res) {
  try {
    // Optional validation
    if (initiatePaymentSchema) {
      const { error, value } = initiatePaymentSchema.validate(req.body);
      if (error)
        return ResponseHandler.badRequest(res, error.details[0].message);
      req.body = value;
    }

    const { name, email, phone, amount, sevaName } = req.body;

    const paymentData = await PaymentService.initiatePayment({
      name,
      email,
      phone,
      amount,
      sevaName,
    });

    return ResponseHandler.success(
      res,
      paymentData,
      'Payment initiated successfully',
      201
    );
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

/**
 * PayU success callback
 */
async function paymentSuccess(req, res) {
  try {
    const data = req.body;

    const payment = await PaymentService.updatePaymentStatus(
      data.txnid,
      'success',
      data
    );

    if (!payment) return ResponseHandler.notFound(res, 'Payment not found');

    return ResponseHandler.success(res, payment, 'Payment successful');
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

/**
 * PayU failure callback
 */
async function paymentFailure(req, res) {
  try {
    const data = req.body;

    const payment = await PaymentService.updatePaymentStatus(
      data.txnid,
      'failed',
      data
    );

    if (!payment) return ResponseHandler.notFound(res, 'Payment not found');

    return ResponseHandler.success(res, payment, 'Payment failed');
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

/**
 * Get payment by txnid
 */
async function getPaymentByTxnId(req, res) {
  try {
    const { txnid } = req.params;
    const payment = await PaymentService.getPaymentByTxnId(txnid);

    if (!payment) return ResponseHandler.notFound(res, 'Payment not found');

    return ResponseHandler.success(
      res,
      payment,
      'Payment fetched successfully'
    );
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

module.exports = {
  initiatePayment,
  paymentSuccess,
  paymentFailure,
  getPaymentByTxnId,
};
