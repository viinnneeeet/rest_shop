const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 20000, // optional: 20s
});

async function verifySMTP() {
  try {
    await transporter.verify();
    console.log('✅ SMTP Server is ready to send emails');
  } catch (err) {
    console.error('❌ SMTP Connection Error:', err);
  }
}

module.exports = { transporter, verifySMTP };
