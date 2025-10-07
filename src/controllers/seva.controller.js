const SevaService = require('../services/seva.service');
const {
  createSevaSchema,
  updateSevaSchema,
} = require('../validations/sevas.validation');
const ResponseHandler = require('../utils/responseHandler'); // assuming you have a standard handler

async function createSeva(req, res) {
  try {
    const { error, value } = createSevaSchema.validate(req.body);
    if (error) return ResponseHandler.badRequest(res, error.details[0].message);

    const seva = await SevaService.createSeva(value);
    return ResponseHandler.success(res, seva, 'Seva created successfully');
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

async function updateSeva(req, res) {
  try {
    const { error, value } = updateSevaSchema.validate(req.body);
    if (error) return ResponseHandler.badRequest(res, error.details[0].message);

    const { id, ...data } = value;
    const seva = await SevaService.updateSeva(id, data);
    if (!seva) return ResponseHandler.notFound(res, 'Seva not found');

    return ResponseHandler.success(res, seva, 'Seva updated successfully');
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

async function deleteSeva(req, res) {
  try {
    const { id } = req.params;
    await SevaService.deleteSeva(id);
    return ResponseHandler.success(res, null, 'Seva deleted successfully');
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

async function getAllSevas(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { category, search, isActive } = req.query;
    const filters = { category, isActive };
    const { sevasList, pagination } = await SevaService.getAllSevas({
      page,
      limit,
      filters,
      search,
    });
    return ResponseHandler.success(
      res,
      { sevasList, pagination },
      'Sevas fetched successfully'
    );
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

async function getSevaById(req, res) {
  try {
    const { id } = req.params;
    const seva = await SevaService.getSevaById(id);
    if (!seva) return ResponseHandler.notFound(res, 'Seva not found');
    return ResponseHandler.success(res, seva, 'Seva fetched successfully');
  } catch (err) {
    return ResponseHandler.error(res, err.message, err);
  }
}

module.exports = {
  createSeva,
  updateSeva,
  deleteSeva,
  getAllSevas,
  getSevaById,
};
