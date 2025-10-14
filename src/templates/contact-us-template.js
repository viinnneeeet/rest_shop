const htmlSections = {
  header: `
    <div class="header">
      <h1>Shree Raghavendra Swami Temple</h1>
      <p class="sub-header">Thank You for Reaching Out 🙏</p>
    </div>
  `,

  userSection: ({ contact }) => `
    <div class="info">
      <div class="section-title">Your Message Details</div>
      <div class="user-details">
        <p><strong>First Name:</strong> ${contact.firstName}</p>
        <p><strong>Last Name:</strong> ${contact.lastName}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        ${
          contact.mobile
            ? `<p><strong>Mobile:</strong> ${contact.mobile}</p>`
            : ''
        }
        <div class="message-box">
          <p><strong>Message:</strong></p>
          <blockquote>${contact.message}</blockquote>
        </div>
      </div>
    </div>
  `,

  footer: `
    <div class="footer">
      <p>Our team will reach out to you shortly.</p>
      <p>With blessings from the temple 🙏</p>
    </div>
  `,

  styles: `
    <style>
      body {
        font-family: "Noto Sans", sans-serif;
        background-color: #faf9f6;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 700px;
        margin: 40px auto;
        background: #fff;
        padding: 40px 50px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #e2b714;
        padding-bottom: 10px;
        margin-bottom: 30px;
      }
      .header h1 {
        margin: 0;
        color: #b58900;
        font-size: 26px;
        letter-spacing: 0.5px;
      }
      .sub-header {
        color: #555;
        margin: 0;
        font-size: 14px;
      }
      .section-title {
        color: #b58900;
        border-bottom: 1px solid #e2b714;
        font-size: 18px;
        margin-bottom: 10px;
        padding-bottom: 4px;
      }
      .info {
        margin-bottom: 25px;
      }
      .user-details {
        background: #fff9e6;
        border: 1px solid #f0d98c;
        border-radius: 8px;
        padding: 15px 20px;
      }
      .message-box {
        margin-top: 10px;
        background: #fff;
        border-left: 3px solid #e2b714;
        padding: 10px 15px;
        border-radius: 4px;
      }
      blockquote {
        margin: 0;
        font-style: italic;
        color: #555;
      }
      .footer {
        text-align: center;
        font-size: 13px;
        color: #777;
        margin-top: 30px;
        border-top: 1px solid #eee;
        padding-top: 10px;
      }
    </style>
  `,
};

// ✅ Combine it into one complete email body
function generateContactEmailHTML(contact) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Contact Confirmation</title>
        ${htmlSections.styles}
      </head>
      <body>
        <div class="email-container">
          ${htmlSections.header}
          ${htmlSections.userSection({ contact })}
          ${htmlSections.footer}
        </div>
      </body>
    </html>
  `;
}

module.exports = { htmlSections, generateContactEmailHTML };
