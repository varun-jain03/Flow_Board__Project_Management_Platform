// Dependencies
const express = require("express");

//File Import
const { register, login, refresh, logout } = require('./auth.controller.js');

const authRouter = express.Router();

// API routes
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);

module.exports = authRouter;