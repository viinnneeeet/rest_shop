const ResponseHandler = require('../utils/responseHandler');
const DashboardService = require('../services/dashboard.service');

async function getDashboardCounts(req, res) {
  try {
    const result = await DashboardService.getDashboardCount();
    return ResponseHandler.success(
      res,
      result,
      'Dashboard data fetched successfully'
    );
  } catch (err) {
    console.log(err);
    return ResponseHandler.error(res, err.message, err);
  }
}

module.exports = {
  getDashboardCounts,
};
