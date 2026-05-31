// Dependencies
const express = require("express");

// File Imports
const { invite, members, updateRole, transfer, remove } = require('./membership.controller.js');
const authMiddleware = require('../../middleware/auth.middleware.js');
const requireOrgRole = require('../../middleware/orgRole.middleware.js');
const requireOrgContext = require('../../middleware/orgContext.middleware.js');

const memberRouter = express.Router();

// Membership Routes
// RBCA Router 1: Getting All The Members Of The Organization
memberRouter.get(
  "/",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin", "member"]),
  members
);

// RBCA Router 2: Inviting a new member to the Organization
memberRouter.post(
  "/invite",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  invite
);

// RBCA Router 3: Changing The Role Of The Member
memberRouter.patch(
  "/role",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  updateRole
);

// RBCA Router 4: Transfer organization ownership
memberRouter.post(
  "/transfer-ownership",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner"]),
  transfer
);

// RBCA ROUTERS: Dynamic Routes 
// RBCA Rouuter 4: Removing The Member From The Organization
memberRouter.delete(
  "/:userId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  remove
);


module.exports = memberRouter;