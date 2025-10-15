const ContactUsService = require('../services/contact-us.service');
const ResponseHandler = require('../utils/responseHandler');
const {
  contactUsSchema,
  replySchema,
} = require('../validations/contact-us.validation');

async function createContactUs(req, res) {
  try {
    const { error, value } = contactUsSchema.validate(req.body);
    if (error) return ResponseHandler.badRequest(res, error.details[0].message);
    const contactUs = await ContactUsService.createContactUs(value);
    return ResponseHandler.success(
      res,
      contactUs,
      'Submitted your request our team will contact you',
      200
    );
  } catch (err) {
    console.log(err);
    return ResponseHandler.error(res, err.message, err);
  }
}

async function getAllContactUsList(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { email, status, search } = req.query;
    const filters = { email, status };
    const { contactsList, pagination } =
      await ContactUsService.getAllContactUsList({
        page,
        limit,
        filters,
        search,
      });

    return ResponseHandler.success(
      res,
      { contactsList, pagination },
      'Contacts list fetched successfully',
      200
    );
  } catch (err) {
    console.log(err);
    return ResponseHandler.error(res, err.message, err);
  }
}
async function replyContactUs(req, res) {
  try {
    // 1️⃣ Validate body
    const { error, value } = replySchema.validate(req.body);
    if (error) return ResponseHandler.badRequest(res, error.details[0].message);

    // 2️⃣ Get contact ID from params
    const { contactId } = req.body;
    if (!contactId)
      return ResponseHandler.badRequest(res, 'Contact ID is required');

    // 3️⃣ Call service
    const result = await ContactUsService.replyContactUs(
      contactId,
      value.response
    );

    // 4️⃣ Send success response
    return ResponseHandler.success(res, result.data, result.message, 200);
  } catch (err) {
    console.error('💥 Error in replyContactUs controller:', err);
    return ResponseHandler.error(res, err.message, err);
  }
}

module.exports = {
  createContactUs,
  getAllContactUsList,
  replyContactUs,
};
