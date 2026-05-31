// Dependencies
const express = require("express");

// File Imports
const authMiddleware = require('../../middleware/auth.middleware.js');
const requireOrgContext = require('../../middleware/orgContext.middleware.js');
const requireOrgRole = require('../../middleware/orgRole.middleware.js');
const { create, getAll, getOne, update, archive, remove } = require('./workspace.controller.js');

const workspaceRouter = express.Router();

// Create Workspace
workspaceRouter.post(
  "/",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  create
);

// Get All Workplaces Of The Organization
workspaceRouter.get(
  "/",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin", "member"]),
  getAll
);

// Get Single Workplaces: By OrganizationId and WorkplaceId ( dynamic )
workspaceRouter.get(
  "/:workspaceId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin", "member"]),
  getOne
);

// Updating The Workspace ( dynamic )
workspaceRouter.patch(
  "/update/:workspaceId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  update
);

// Archive The Workspace ( dynamic )
workspaceRouter.patch(
  "/archive/:workspaceId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  archive
);

// Deleting the Workspace ( dynamic )
workspaceRouter.delete(
  "/:workspaceId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  remove
);



module.exports = workspaceRouter;