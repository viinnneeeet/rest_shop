const nodemailer = require('nodemailer');

async function sendMail({ to, subject, html, attachments = [] }) {
  try {
    // ✅ Setup transporter (SMTP details from env)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ Email options
    const mailOptions = {
      from: `"Temple Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments,
    };

    // ✅ Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}: ${info.messageId}`);

    return info;
  } catch (err) {
    console.error('❌ Failed to send email:', err);
    throw err;
  }
}

module.exports = sendMail;
