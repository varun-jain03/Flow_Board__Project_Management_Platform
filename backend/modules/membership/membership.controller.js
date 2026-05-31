// File Imports
const {
  inviteUser,
  listMembers,
  changeMemberRole,
  transferOwnership,
  removeMember
} = require('./membership.service.js');
const { switchOrganization } = require('../organization/organization.service.js');
const ApiResponse  = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const ApiError = require('../../utils/ApiError.js');


// Invite new member to orgainzation
const invite = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json(new ApiResponse(400, "Name And Email Is Required..."));
  }

  const membership = await inviteUser({
    orgId: req.user.orgId,
    inviterUserId: req.user.userId,
    inviteeEmail: email,
    role,
    requesterOrgRole: req.user.orgRole
  });

  res.status(201).json(new ApiResponse(201, membership, "User Added To Organization..."));
});

// All The Members Of The Oragnization
const members = asyncHandler(async (req, res) => {
  const list = await listMembers({ orgId: req.user.orgId });
  res.status(200).json(new ApiResponse(200, list, "Members Fetched..."));
})

// Changing The Role Of The Member
const updateRole = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;

  const updated = await changeMemberRole({
    orgId: req.user.orgId,
    targetUserId: userId,
    newRole: role,
    requesterOrgRole: req.user.orgRole
  });

  res.status(200).json(new ApiResponse(200, updated, "Role Updated...")); 
});

// Transfer organization ownership
const transfer = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ApiError(400, "User ID Required...");
  }

  await transferOwnership({
    orgId: req.user.orgId,
    targetUserId: userId,
    requesterUserId: req.user.userId,
    requesterOrgRole: req.user.orgRole
  });

  const session = await switchOrganization({
    userId: req.user.userId,
    orgId: req.user.orgId,
    globalRole: req.user.role
  });

  res.status(200).json(new ApiResponse(200, session, "Ownership Transferred..."));
});

// Romoving The Member From The Organization
const remove = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  await removeMember({
    orgId: req.user.orgId,
    targetUserId: userId,
    requesterUserId: req.user.userId,
    requesterOrgRole: req.user.orgRole
  });

  res.status(200).json(new ApiResponse(200, null, "Member Removed..."));
});

module.exports = { invite, members, updateRole, transfer, remove };
