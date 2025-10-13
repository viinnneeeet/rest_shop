const InvoiceService = require('../services/invoice.service');
const { sevaBookingSchema } = require('../validations/invoice.validation');
const ResponseHandler = require('../utils/responseHandler');

async function createInvoice(req, res) {
  try {
    // 1️⃣ Validate input
    const { error, value } = sevaBookingSchema.validate(req.body);
    if (error) {
      return ResponseHandler.badRequest(res, error.details[0].message);
    }

    const { user, seva } = value;

    if (!user || !seva) {
      return ResponseHandler.badRequest(res, 'User or Seva data missing');
    }

    // 2️⃣ Generate PDF and save booking (Cloudinary upload handled in service)
    const { invoiceId, invoiceUrl, booking } =
      await InvoiceService.generateInvoicePDF(user, seva);

    // 3️⃣ Send JSON response (do NOT send PDF in response)
    return ResponseHandler.success(
      res,
      { invoiceId, invoiceUrl, booking },
      'Invoice generated successfully'
    );
  } catch (err) {
    console.error(err);
    return ResponseHandler.error(res, 'Failed to generate invoice', err);
  }
}

async function getAllInvoices(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { category, search, isActive } = req.query;
    const filters = { category };
    const { invoiceList, pagination } = await InvoiceService.getAllInvoices({
      page,
      limit,
      filters,
      search,
      isActive,
    });
    return ResponseHandler.success(
      res,
      {
        invoiceList,
        pagination,
      },
      'Invoices fetched successfully'
    );
  } catch (err) {
    console.error(err);
    return ResponseHandler.error(res, 'Failed to fetch invoices', err);
  }
}

module.exports = {
  createInvoice,
  getAllInvoices,
};
