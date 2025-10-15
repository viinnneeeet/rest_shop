const db = require('../db/models');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier'); // to stream PDF buffer
const { generatePDF } = require('./genrate-pdf.service');
const { htmlSections } = require('../templates/seva-invoice-template');
const sendMail = require('../utils/sendMail');

async function generateInvoicePDF(user, seva) {
  try {
    if (!user || !seva) {
      throw new Error('User and Seva data are required to generate invoice.');
    }
    const htmlContent = `
        <h2>🙏 Thank you for your Seva, ${user.name}!</h2>
        <p>Here’s your invoice for <strong>${seva.title}</strong>.</p>
        <p>Amount: ₹${seva.amount}</p>
        <p>Date: ${new Date(seva.date).toLocaleDateString()}</p>
        <br/>
        <p>Best regards,<br/>Temple Support Team</p>
      `;
    // 1️⃣ Create DB record first (without invoiceUrl)
    const booking = await db.SevaBooking.create({
      userName: user.name,
      userEmail: user.email,
      userMobile: user.phone,
      sevaTitle: seva.title,
      sevaDescription: seva.description || null,
      sevaAmount: seva.amount,
      sevaDate: seva.date,
    });
    const pdfBuffer = await createInvoicePDF(user, seva);
    const invoiceId = `INV-${booking.id.toString().padStart(4, '0')}`; // e.g., INV-0001

    if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
      throw new Error('Failed to create valid PDF buffer.');
    }

    // const uploadResult = await uploadInvoicePdf(invoiceId, pdfBuffer);

    // 4️⃣ Update booking with invoice URL
    // await booking.update({ invoiceUrl: uploadResult.secure_url });

    // 5️⃣ Email the invoice to the user
    await sendMail({
      to: user.email,
      subject: `Your Seva Invoice - ${invoiceId}`,
      html: htmlContent,
      attachments: [
        {
          filename: `${invoiceId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    console.log(`📨 Invoice emailed successfully to ${user.email}`);

    return {
      invoiceId,
      // invoiceUrl: uploadResult.secure_url,
      booking: booking.get({ plain: true }),
    };
  } catch (err) {
    console.error('💥 Error generating invoice PDF:', err);
    throw new Error('Failed to generate invoice');
  }
}

async function getAllInvoices({ page = 1, limit = 10, filters = {}, search }) {
  try {
    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters dynamically
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '') where[key] = value;
    }

    // Apply search (if any)
    if (search) {
      const { Op } = db.Sequelize;
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await db.SevaBooking.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    return {
      invoiceList: rows,
      pagination: {
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        perPage: limit,
      },
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function createInvoicePDF(user, seva) {
  const htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Seva Invoice</title>
        ${htmlSections.styles}
      </head>
      <body>
        <div class="invoice-container">
          ${htmlSections.header}
          ${htmlSections.devoteeSection({ user })}
          ${htmlSections.sevaSection({ seva })}
          ${htmlSections.footer}
        </div>
      </body>
    </html>
  `;

  const pdfBuffer = await generatePDF(htmlContent);
  return pdfBuffer;
}

async function uploadInvoicePdf(invoiceId, pdfBuffer) {
  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'invoices',
          public_id: invoiceId,
          format: 'pdf',
          sign_url: false, // ✅ Make URL permanent/public
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
    });
    return uploadResult;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { generateInvoicePDF, getAllInvoices };
