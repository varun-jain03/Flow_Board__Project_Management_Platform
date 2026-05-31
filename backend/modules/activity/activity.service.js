// File Imports
const { createActivity, findActivitiesByOrg } = require('./activity.repository.js');

// Create Log Activity
const logActivity = async ({
  action,
  entityType,
  entityId,
  organizationId,
  workspaceId = null,
  boardId = null,
  performedBy,
  metadata = {}
}) => {
  return createActivity({
    action, 
    entityType,
    entityId,
    organizationId,
    workspaceId,
    boardId,
    performedBy,
    metadata
  });
};

// Get Activities
const getOrgActivites = async ({ organizationId }) => {
  return findActivitiesByOrg(organizationId);
};


module.exports = { logActivity, getOrgActivites };