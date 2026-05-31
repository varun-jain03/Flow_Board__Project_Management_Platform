// File Imports
const { createOrganization, getMyOrganization, getOrganizationById, switchOrganization } = require('./organization.service.js');
const ApiResponse  = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const ApiError = require('../../utils/ApiError.js');

// Creating a Organization
const createOrg = asyncHandler(async (req, res) => {
  const org = await createOrganization({
    name: req.body.name,
    userId: req.user.userId
  });
  res.status(201).json(new ApiResponse(201, org, "Organization Created..."));
})

// Get Users Organization
const myOrgs = asyncHandler(async (req, res) => {
  const orgs = await getMyOrganization({
    userId: req.user.userId
  });
  console.log(req.user);
  res.status(200).json(new ApiResponse(200, orgs, `All The Organizations Fetched...`));
})

// Get A Single Organization By Id
const getOrg = asyncHandler(async (req, res) => {
  const org = await getOrganizationById({
    userId: req.user.userId,
    orgId: req.params.id
  });

  res.status(200).json(new ApiResponse(200, org, `${org.name} details fetched...`))
})

// Switching Organization From All The Organizations User Is Part Of
const switchOrg = asyncHandler(async (req, res) => {
  const { organizationId } = req.body;
  if (!organizationId) {
    return res.status(400).json(new ApiResponse(400, null, "Organization Not Found..."));
  };

  const result = await switchOrganization({
    userId: req.user.userId,
    orgId: organizationId,
    globalRole: req.user.role
  });

  res.status(200).json(new ApiResponse(200, result, "Organization Switched..."));
});

module.exports = { createOrg, myOrgs, getOrg, switchOrg };