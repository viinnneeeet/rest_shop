const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

async function createTransporter() {
  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // redirect URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  try {
    const accessTokenObj = await oauth2Client.getAccessToken();
    const accessToken = accessTokenObj?.token;

    if (!accessToken) {
      throw new Error('Failed to retrieve access token.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.verify();
    console.log('✅ Gmail OAuth2 Transporter Ready');
    return transporter;
  } catch (err) {
    console.error('❌ Failed to create transporter:', err);
    throw err;
  }
}

async function verifySMTP() {
  try {
    const transporter = await createTransporter();
    await transporter.verify();
    console.log('✅ Gmail OAuth2 connection successful — ready to send emails');
  } catch (err) {
    console.error('❌ SMTP Verification Failed:', err.message || err);
  }
}
if (!process.env.GOOGLE_REFRESH_TOKEN) {
  console.error(
    '🚨 Missing GOOGLE_REFRESH_TOKEN! Check your .env or Render environment.'
  );
}

module.exports = { createTransporter, verifySMTP };
