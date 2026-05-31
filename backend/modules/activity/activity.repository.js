// File Import
const ActivityModel = require('./activity.model.js');


// Create Activity
const createActivity = (data) => {
  return ActivityModel.create(data);
};

// Get Org Activities
const findActivitiesByOrg = (organizationId) => {
  return ActivityModel.find({ organizationId })
    .sort({ createdAt: -1 })
    .limit(50);
};

module.exports = { createActivity, findActivitiesByOrg };