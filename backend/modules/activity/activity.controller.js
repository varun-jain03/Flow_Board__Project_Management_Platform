// File Imports
const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const { getOrgActivites } = require('./activity.service.js');

// Get All Activities
const getAll = asyncHandler(async (req, res) => {
  const activites = await getOrgActivites({
    organizationId: req.user.orgId
  });

  res.status(200).json(new ApiResponse(200, activites, "Activites Fetched Successfully..."));
});


module.exports = getAll;