// Dependencies
const express = require("express");

// File Imports
const { create, getAll, remove } = require('./comment.controller.js');
const authMiddleware = require('../../middleware/auth.middleware.js');
const requireOrgContext = require('../../middleware/orgContext.middleware.js');
const requireOrgRole = require('../../middleware/orgRole.middleware.js');

const commentRouter = express.Router();

// Create Comment
commentRouter.post(
  "/",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin", "member"]),
  create
);

// Get All Comments
commentRouter.get(
  "/task/:taskId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin", "member"]),
  getAll
);

// Delete Comment
commentRouter.delete(
  "/:commentId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin", "member"]),
  remove
);

module.exports = commentRouter;