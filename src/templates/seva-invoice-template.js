const htmlSections = {
  header: `
    <div class="header">
      <h1>Shree Raghavendra Swami Temple</h1>
      <p class="sub-header">Seva Invoice</p>
    </div>
  `,

  devoteeSection: ({ user }) => `
    <div class="info">
      <div class="section-title">Devotee Details</div>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
    </div>
  `,

  sevaSection: ({ seva }) => `
    <div class="info">
      <div class="section-title">Seva Details</div>
      <div class="seva-details">
        <p><strong>Seva Name:</strong> ${seva.title}</p>
        <p><strong>Description:</strong> ${seva.description}</p>
        <p class="amount"><strong>Amount:</strong> ₹${seva.amount}</p>
        <p><strong>Date:</strong> ${new Date(seva.date).toLocaleDateString(
          'en-IN'
        )}</p>
      </div>
    </div>
  `,

  footer: `
    <div class="footer">
      <p>May the divine blessings of Devi be with you always.</p>
      <p>Thank you for your seva contribution 🙏</p>
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
      .invoice-container {
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
        font-size: 28px;
        letter-spacing: 1px;
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
        margin-bottom: 8px;
        padding-bottom: 4px;
      }
      .info {
        margin-bottom: 30px;
      }
      .seva-details {
        background: #fff9e6;
        border: 1px solid #f0d98c;
        border-radius: 8px;
        padding: 15px 20px;
      }
      .amount {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
      .footer {
        text-align: center;
        font-size: 13px;
        color: #777;
        margin-top: 30px;
        border-top: 1px solid #eee;
        padding-top: 10px;
      }
      .logo {
        width: 80px;
        margin-bottom: 10px;
      }
    </style>
  `,
};

module.exports = { htmlSections };
