const { createTransporter } = require('../config/mailer'); // path to your mailer.js

async function sendMail({ to, subject, html, attachments = [] }) {
  try {
    const mailOptions = {
      from: `"Temple Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments,
    };

    const transporter = await createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}: ${info.messageId}`);

    return info;
  } catch (err) {
    console.error('❌ Failed to send email:', err);
    throw err;
  }
}

module.exports = sendMail;
