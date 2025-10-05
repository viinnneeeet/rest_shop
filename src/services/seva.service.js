const sequelize = require('../config/mysqlDb');
const queries = require('../db/queries/seva.queries');

async function createSeva(data) {
  const formattedData = {
    ...data,
    benefits: JSON.stringify(data.benefits || []), // 👈 convert array to JSON string
  };
  await sequelize.query(queries.CREATE_SEVA, { replacements: formattedData });
  const [result] = await sequelize.query(
    'SELECT * FROM sevas ORDER BY id DESC LIMIT 1;'
  );
  return result[0];
}

async function updateSeva(id, data) {
  if (data.benefits && Array.isArray(data.benefits)) {
    data.benefits = JSON.stringify(data.benefits);
  }
  await sequelize.query(queries.UPDATE_SEVA, { replacements: { id, ...data } });
  const [rows] = await sequelize.query(queries.GET_SEVA_BY_ID, {
    replacements: { id },
  });
  return rows[0];
}

async function deleteSeva(id) {
  await sequelize.query(queries.DELETE_SEVA, { replacements: { id } });
  return { message: 'Seva deleted successfully' };
}

async function getAllSevas() {
  const [rows] = await sequelize.query(queries.GET_ALL_SEVAS);
  return rows;
}

async function getActiveSevas() {
  const [rows] = await sequelize.query(queries.GET_ACTIVE_SEVAS);
  return rows;
}

async function getSevaById(id) {
  const [rows] = await sequelize.query(queries.GET_SEVA_BY_ID, {
    replacements: { id },
  });
  return rows[0];
}

module.exports = {
  createSeva,
  updateSeva,
  deleteSeva,
  getAllSevas,
  getActiveSevas,
  getSevaById,
};
