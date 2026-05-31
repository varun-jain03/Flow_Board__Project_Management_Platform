// Dependencies
const jwt = require("jsonwebtoken");

// File Import
require('dotenv').config();
const ApiError = require('../../utils/ApiError.js');
const { createOrganizations, findOrgById, findOrgBySlug } = require('./organization.repository.js');
const { createMemberships, findMembership, findUserMembership, findOrgMembership } = require('../membership/membership.repository.js');

const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Creating a Organization
const createOrganization = async ({ name, userId }) => {
  if (!name) throw new ApiError(400, "Organization name is required...");

  const slug = slugify(name);

  const existing = await findOrgBySlug(slug);
  if (existing) throw new ApiError(409, "Organization Slug Already Exist...");

  const org = await createOrganizations({ name, slug, createdBy: userId });

  await createMemberships({ 
    userId,
    organizationId: org._id,
    role: "owner",
    status: "active"
  });

  return org;
}

// Get Users Organizations
const getMyOrganization = async ({ userId }) => {
  const memberships = await findUserMembership(userId);
  return memberships;
  // return memberships.map((m) => m.organizationId);
}

// Get A Single organization by id
const getOrganizationById = async ({ orgId, userId }) => {
  const membership = await findMembership({ userId, organizationId: orgId });
  if (!membership) {
    throw new ApiError(403, "You Are Not The Member Of This Organization...");
  }
  if (membership.status !== "active") {
    throw new ApiError(403, "status inActive...");
  }

  const org = await findOrgById(orgId);
  if (!org) throw new ApiError(404, "Organization Not Found...");

  return org;
}

// Switching Organization From All The Organizations User Is Part Of
const switchOrganization = async ({ userId, orgId, globalRole }) => {
  const org = await findOrgById(orgId);
  if (!org) throw new ApiError(404, "Organization Not Found...");

  const membership = await findMembership({ userId, organizationId: orgId });
  if (!membership || membership.status !== "active") {
    throw new ApiError(403, "You Are Not A Member Of This Organization...");
  } 

  const orgScopedAccesstoken = jwt.sign(
    {
      userId,
      role: globalRole,
      orgId: org._id.toString(),
      orgRole: membership.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  return {
    accessToken: orgScopedAccesstoken,
    org: {
      id: org._id,
      name: org.name,
      slug: org.slug
    },
    membership: {
      role: membership.role,
      status: membership.status
    }
  };
};

module.exports = { createOrganization, getMyOrganization, getOrganizationById, switchOrganization };