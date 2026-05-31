// Dependecies
const express = require("express");

// File Imports
const authMiddleware = require('../../middleware/auth.middleware.js');
const requireOrgContext = require('../../middleware/orgContext.middleware.js');
const requireOrgRole = require('../../middleware/orgRole.middleware.js');
const getAll = require('./activity.controller.js');

const activityRouter = express.Router();

// Getting All Activities
activityRouter.get(
  "/",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin", "member"]),
  getAll
);


module.exports = activityRouter;