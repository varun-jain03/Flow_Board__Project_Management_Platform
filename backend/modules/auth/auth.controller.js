// File Import
const asyncHandler = require('../../utils/asyncHandler.js');
const { registerUser, loginUser, refreshTokens, logoutUser } = require('./auth.service.js');
const ApiResponse = require('../../utils/ApiResponse.js');

const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json(new ApiResponse(201, user, "User registered..."));
});

const login = asyncHandler(async (req, res) => {
  const tokens = await loginUser(req.body.email, req.body.password);
  res.status(200).json(new ApiResponse(200, tokens, "Login successfull..."));
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken, organizationId } = req.body;

  const tokens = await refreshTokens({ refreshToken, organizationId });
  res.status(200).json(new ApiResponse(200, tokens, "Token refreshed..."))
})

const logout = asyncHandler(async (req, res) => {
  const tokens = await logoutUser(req.body);
  res.status(200).json(new ApiResponse(200, null, "Logged  out successful..."));
})

module.exports = { register, login, refresh, logout };