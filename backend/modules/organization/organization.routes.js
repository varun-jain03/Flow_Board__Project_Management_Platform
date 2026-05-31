// Dependencies
const express = require("express");

// File Imports
const { createOrg, myOrgs, getOrg, switchOrg } = require('./organization.controller.js');
const authMiddleware = require('../../middleware/auth.middleware.js');
const requireOrgRole = require('../../middleware/orgRole.middleware.js');
const requireOrgContext = require('../../middleware/orgContext.middleware.js');

const orgRouter = express.Router();

// Organization Routers
orgRouter.post("/", authMiddleware, createOrg);              //create organization
orgRouter.get("/", authMiddleware, myOrgs);                  //fetch my organization
orgRouter.post("/switch", authMiddleware, switchOrg);        //swictching the organization

// Dynamic routes
orgRouter.get("/:id", authMiddleware, getOrg);               //fetching single organization

module.exports = orgRouter;