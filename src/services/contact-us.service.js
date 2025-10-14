const db = require('../db/models');
const {
  generateContactEmailHTML,
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
      console.log(mail);
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

module.exports = {
  createContactUs,
  getAllContactUsList,
};
