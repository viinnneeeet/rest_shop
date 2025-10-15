const db = require('../db/models');

async function getDashboardCount() {
  try {
    // helper to get grouped count + total
    const getGroupedCountWithTotal = async (Model, field) => {
      const grouped = await Model.findAll({
        attributes: [
          field,
          [db.Sequelize.fn('COUNT', db.Sequelize.col(field)), 'count'],
        ],
        group: [field],
        raw: true,
      });

      const total = grouped.reduce((sum, item) => sum + Number(item.count), 0);

      return { grouped, total };
    };

    // parallelize all queries
    const [
      sevaSummary,
      eventSummary,
      gallerySummary,
      contactSummary,
      totalDonation,
      donationCount,
    ] = await Promise.all([
      getGroupedCountWithTotal(db.Sevas, 'availability'),
      getGroupedCountWithTotal(db.Events, 'status'),
      getGroupedCountWithTotal(db.Gallery, 'category'),
      getGroupedCountWithTotal(db.ContactUs, 'status'),
      db.SevaBooking.sum('sevaAmount'),
      db.SevaBooking.count(),
    ]);

    return {
      sevas: {
        summary: sevaSummary.grouped,
        total: sevaSummary.total,
      },
      events: {
        summary: eventSummary.grouped,
        total: eventSummary.total,
      },
      gallery: {
        summary: gallerySummary.grouped,
        total: gallerySummary.total,
      },
      contact: {
        summary: contactSummary.grouped,
        total: contactSummary.total,
      },
      donations: {
        total: Number(totalDonation) || 0,
        count: donationCount || 0,
      },
    };
  } catch (err) {
    console.error('❌ Error in getDashboardCount:', err);
    throw err;
  }
}

module.exports = {
  getDashboardCount,
};
