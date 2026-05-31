// dependencies
const express = require("express");

// File Imports
const authMiddleware = require('../../middleware/auth.middleware.js');
const requireOrgContext = require('../../middleware/orgContext.middleware.js');
const requireOrgRole = require("../../middleware/orgRole.middleware.js");
const { create, getAll, getOne, update, archive, remove } = require('./board.controller.js');


const boardRouter = express.Router();


// Creating New Board
boardRouter.post(
  "/",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  create
);

// Fetching All The Boards From Organization (Dynamic)
boardRouter.get(
  "/workspace/:workspaceId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin", "member"]),
  getAll
);

// Fetching The Single Board From Organization (Dynamic)
boardRouter.get(
  "/workspace/:workspaceId/:boardId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin", "member"]),
  getOne
);

// Updating The Board (Dynamic)
boardRouter.patch(
  "/workspace/:workspaceId/:boardId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  update
);

// Updating The Archive Status Of Board (dynamic)
boardRouter.patch(
  "/workspace/:workspaceId/archive/:boardId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  archive
);

// Delete The Board (dynamic)
boardRouter.delete(
  "/workspace/:workspaceId/:boardId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  remove
);


module.exports = boardRouter;