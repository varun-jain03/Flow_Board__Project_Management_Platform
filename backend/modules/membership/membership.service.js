// File Import
const { 
  createMemberships,
  findMembership, 
  findUserMembership, 
  findOrgMembership, 
  updateMembershipRole, 
  deleteMembership 
} = require('./membership.repository.js');
const ApiError = require('../../utils/ApiError.js');
const { findUserByEmail } = require('../users/user.repository.js');

// Invite new member to orgainzation
const inviteUser = async ({ orgId, inviterUserId, inviteeEmail, role, requesterOrgRole }) => {
  const safeRole = role || "member";
  if (!["admin", "member"].includes(safeRole)) {
    throw new ApiError(400, "Invalid Role For Inviting...");
  }

  if (safeRole === "admin" && requesterOrgRole !== "owner") {
    throw new ApiError(403, "Only Owner Can Invite As Admin...");
  }

  const invitee = await findUserByEmail(inviteeEmail);
  if (!invitee) throw new ApiError(404, "User Not Found With This Email...");

  const existing = await findMembership({
    userId: invitee._id,
    organizationId: orgId
  });
  if (existing) throw new ApiError(409, "User Already A Member Or Already Invited...");

  const membership = await createMemberships({
    userId: invitee._id,
    organizationId: orgId,
    role: safeRole,
    status: "active",
    invitedBy: inviterUserId
  });

  return membership;
}

// All The Members Of The Oragnization
const listMembers = async ({ orgId }) => {
  return findOrgMembership(orgId);
} 

// Changing The Role Of The Member
const changeMemberRole = async ({ orgId, targetUserId, newRole, requesterOrgRole }) => {
  if (!["admin", "member"].includes(newRole)) {
    throw new ApiError(400, "Invalid Role...");
  };

  if (newRole === "admin" && requesterOrgRole !== "owner") {
    throw new ApiError(403, "Only Owner Can Promote To Admin...");
  };

  const targetMembership = await findMembership({
    userId: targetUserId,
    organizationId: orgId
  });
  if (!targetMembership) throw new ApiError(404, "Membership Not Found...");

  if (targetMembership.role === "owner") {
    throw new ApiError(400, "Cannot Change Owner Role. Use Transfer Ownership...");
  }

  if (requesterOrgRole === "admin" && targetMembership.role === "admin") {
    throw new ApiError(403, "Only Owner Can Change An Admin's Role...");
  }

  const updated = await updateMembershipRole({
    userId: targetUserId,
    organizationId: orgId,
    role: newRole
  });

  if (!updated) throw new ApiError(404, "Membership Not Found...");

  return updated;
}

// Transfer organization ownership to another member
const transferOwnership = async ({
  orgId,
  targetUserId,
  requesterUserId,
  requesterOrgRole
}) => {
  if (requesterOrgRole !== "owner") {
    throw new ApiError(403, "Only Owner Can Transfer Ownership...");
  }

  if (String(targetUserId) === String(requesterUserId)) {
    throw new ApiError(400, "You Are Already The Owner...");
  }

  const targetMembership = await findMembership({
    userId: targetUserId,
    organizationId: orgId
  });
  if (!targetMembership) throw new ApiError(404, "Membership Not Found...");

  if (targetMembership.role === "owner") {
    throw new ApiError(400, "Target User Is Already Owner...");
  }

  if (targetMembership.status !== "active") {
    throw new ApiError(400, "Cannot Transfer Ownership To Inactive Member...");
  }

  await updateMembershipRole({
    userId: requesterUserId,
    organizationId: orgId,
    role: "admin"
  });

  const updated = await updateMembershipRole({
    userId: targetUserId,
    organizationId: orgId,
    role: "owner"
  });

  if (!updated) throw new ApiError(404, "Membership Not Found...");

  return updated;
}

// Removing The Member From The Organization
const removeMember = async ({ orgId, targetUserId, requesterUserId, requesterOrgRole }) => {
  if (String(targetUserId) === String(requesterUserId)) {
    throw new ApiError(400, "You Cannot Remove Yourself...");
  };

  // Only Owner Can Remove Admin
  const targetMembership = await findMembership({
    userId: targetUserId,
    organizationId: orgId
  });
  if (!targetMembership) throw new ApiError(404, "Membership Not Found...");

  if (targetMembership.role === "admin" && requesterOrgRole !== "owner") {
    throw new ApiError(403, "Only Owner Can Remove An Admin...");
  };

  await deleteMembership({ userId: targetUserId, organizationId: orgId });
  return true;
};

module.exports = {
  inviteUser,
  listMembers,
  changeMemberRole,
  transferOwnership,
  removeMember
};