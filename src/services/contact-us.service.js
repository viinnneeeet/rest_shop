const db = require('../db/models');
const {
  generateContactEmailHTML,
  generateReplyEmailHTML,
} = require('../templates/contact-us-template');
const sendMail = require('../utils/sendMail');

async function createContactUs(data) {
  try {
    const contact = await db.ContactUs.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      messages: data.messages,
    });
    const plainContact = contact.get({ plain: true });
    try {
      const mail = await sendMail({
        to: plainContact.email,
        subject: 'Thank You for Contacting Shree Raghavendra Swami Temple',
        html: generateContactEmailHTML(plainContact),
      });
    } catch (err) {
      console.log(err);
      throw err;
    }

    return plainContact;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getAllContactUsList({
  page = 1,
  limit = 10,
  filters = {},
  search,
}) {
  try {
    const offset = (page - 1) * limit;
    const where = {};
    const { Op } = db.Sequelize;

    // Apply dynamic filters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '') where[key] = value;
    }
    const { count, rows } = await db.ContactUs.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    return {
      contactsList: rows,
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

async function replyContactUs(contactId, replyMessage) {
  try {
    // 1️⃣ Fetch contact record
    const contact = await db.ContactUs.findByPk(contactId);

    if (!contact) {
      throw new Error(`Contact entry with ID ${contactId} not found.`);
    }

    const plainContact = contact.get({ plain: true });

    // 2️⃣ Compose and send the reply email
    try {
      const mail = await sendMail({
        to: plainContact.email,
        subject: `Re: Your message to Shree Raghavendra Swami Temple 🙏`,
        html: generateReplyEmailHTML(plainContact, replyMessage),
      });

      console.log(`📨 Reply sent to ${plainContact.email}:`, mail.messageId);

      // 3️⃣ Optionally store the reply in DB
      await contact.update({
        replyMessage,
        repliedAt: new Date(),
        status: 'Replied',
      });

      return {
        success: true,
        message: 'Reply email sent successfully',
        data: {
          contact: contact.get({ plain: true }),
          mailId: mail.messageId,
        },
      };
    } catch (err) {
      console.error('❌ Failed to send reply email:', err);
      throw new Error('Failed to send reply email');
    }
  } catch (err) {
    console.error('💥 Error in replyContactUs:', err);
    throw err;
  }
}

module.exports = {
  createContactUs,
  getAllContactUsList,
  replyContactUs,
};
