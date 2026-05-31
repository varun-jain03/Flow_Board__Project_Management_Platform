// Dependencies
const express = require("express");

// File Imports
const authMiddleware = require('../../middleware/auth.middleware.js');
const requireOrgContext = require('../../middleware/orgContext.middleware.js');
const requireOrgRole = require('../../middleware/orgRole.middleware.js');
const { create, getAll, getOne, update, remove } = require('./task.controller.js');

const taskRouter = express.Router();

// Create New Tasks
taskRouter.post(
  "/",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", 'admin']),
  create
);

// Get All Tasks (Dynamic)
taskRouter.get(
  "/board/:workspaceId/:boardId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin", "member"]),
  getAll
);

// Get Single task (Dynamic)
taskRouter.get(
  "/board/:workspaceId/:boardId/:taskId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  getOne
);

// Update Task (Dynamic)
taskRouter.patch(
  "/board/:workspaceId/:boardId/:taskId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  update
);

// Delete Task
taskRouter.delete(
  "/board/:workspaceId/:boardId/:taskId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  remove
);


module.exports = taskRouter;