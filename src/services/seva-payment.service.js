const db = require('../db/models'); // Sequelize models
const crypto = require('crypto');

const PAYU_KEY = process.env.PAYU_KEY;
const PAYU_SALT = process.env.PAYU_SALT;
const PAYU_BASE_URL = process.env.PAYU_BASE_URL || 'https://test.payu.in';
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

/**
 * ✅ Generate PayU hash
 */
function generateHash({ txnid, amount, sevaName, name, email }) {
  const hashString = `${PAYU_KEY}|${txnid}|${amount}|${sevaName}|${name}|${email}|||||||||||${PAYU_SALT}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
}

/**
 * ✅ Initiate a new payment
 */
async function initiatePayment({ name, email, phone, amount, sevaName }) {
  try {
    const txnid = `txn_${Date.now()}`;

    const hash = generateHash({ txnid, amount, sevaName, name, email });

    // Save to DB as pending
    await db.Payments.create({
      txnid,
      seva_name: sevaName,
      amount,
      name,
      email,
      phone,
      status: 'pending',
    });

    return {
      payuData: {
        key: PAYU_KEY,
        txnid,
        amount,
        productinfo: sevaName,
        firstname: name,
        email,
        phone,
        surl: `${BASE_URL}/api/payment/success`,
        furl: `${BASE_URL}/api/payment/failure`,
        hash,
      },
      actionUrl: `${PAYU_BASE_URL}/_payment`,
    };
  } catch (err) {
    console.error('Error initiating payment:', err);
    throw new Error('Failed to initiate payment');
  }
}

/**
 * ✅ Update payment status by txnid
 */
async function updatePaymentStatus(txnid, status, payuResponse) {
  try {
    const [updatedRows] = await db.Payments.update(
      { status, payu_response: payuResponse },
      { where: { txnid } }
    );

    if (updatedRows === 0) {
      throw new Error(`Payment with txnid ${txnid} not found`);
    }

    const payment = await db.Payments.findByPk(txnid);
    return payment.get({ plain: true });
  } catch (err) {
    console.error('Error updating payment status:', err);
    throw new Error('Failed to update payment status');
  }
}

/**
 * ✅ Get payment by txnid
 */
async function getPaymentByTxnId(txnid) {
  try {
    const payment = await db.Payments.findOne({ where: { txnid } });
    return payment ? payment.get({ plain: true }) : null;
  } catch (err) {
    console.error('Error fetching payment:', err);
    throw new Error('Failed to fetch payment');
  }
}

module.exports = {
  generateHash,
  initiatePayment,
  updatePaymentStatus,
  getPaymentByTxnId,
};
