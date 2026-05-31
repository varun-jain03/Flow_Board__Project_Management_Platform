// Dependencies
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// File Import
const { findUserByEmail, createUser, findUserByRefreshTokenHash, saveUser } = require('./auth.repository.js');
const { createOrganizations, findOrgById, findOrgBySlug } = require('../organization/organization.repository.js');
const {
  createMemberships,
  findMembership,
  findUserMembership,
  findOrgMembership,
  updateMembershipRole,
  deleteMembership
} = require('../membership/membership.repository.js');
const ApiError = require('../../utils/ApiError.js');
const ApiResponse = require('../../utils/ApiResponse.js');

//Generate Hash token 
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

//Generates the token
const generateAccessToken = (user) => {
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  return token;
}

//Generate refresh token
const generateRefreshToken = () => crypto.randomBytes(64).toString("hex");

//Prevents I never leak password in ApiResponse
const sanitizeUser = (userDoc) => {
  if (!userDoc) return userDoc;
  const obj = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};


// Routes
// Registering a new user
const registerUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "User Already Exist...");
  }

  const hashedPass = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

  const registeredUser = await createUser({
    name,
    email,
    password: hashedPass
  });
  return sanitizeUser(registeredUser);
};

// Loging in the user
const loginUser = async (email, password) => {
  const existingUser = await findUserByEmail(email);
  if (!existingUser) {
    throw new ApiError(401, "email not registred...");
  }

  if (!existingUser.isActive) {
    throw new ApiError(403, "Account is disabled...");
  }

  const isHashed = await bcrypt.compare(password, existingUser.password);
  if (!isHashed) {
    throw new ApiError(401, "incorrect password...");
  }

  const accessToken = generateAccessToken(existingUser);

  //create refresh token + hashed refresh token stored inside the data base 
  const refreshToken = generateRefreshToken();
  existingUser.refreshToken = hashToken(refreshToken);
  existingUser.lastLoginAt = new Date();
  await saveUser(existingUser);

  return { accessToken, refreshToken };
};

// Refreshing the token
const refreshTokens = async ({ refreshToken, organizationId }) => {
  if (!refreshToken) throw new ApiError(401, "Refresh token required...");

  const refreshHash = hashToken(refreshToken);

  const user = await findUserByRefreshTokenHash(refreshHash);
  if (!user) throw new ApiError(401, "Invalid refresh token...");
  if (!user.isActive) throw new ApiError(403, "Account is disabled...");

  if (organizationId) {
    const org = await findOrgById(organizationId);
    if (!org) throw new ApiError(404, "Organization Not Found...");

    // Verify Membership
    const membership = await findMembership({
      userId: user._id,
      organizationId: organizationId
    });

    if (!membership || membership.status !== "active") {
      throw new ApiError(403, "You Are Not Member Of This Organization...");
    };

    const orgScopedAccessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        orgId: org._id.toString(),
        orgRole: membership.role
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } 
    );
    // Rotate Refresh Token
    const newRefreshToken = generateRefreshToken();
    user.refreshToken = hashToken(newRefreshToken);
    await saveUser(user);

    return {
      accessToken: orgScopedAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  // Id OrgId Not Provided
  const newAccessToken = generateAccessToken(user);

  //Rotate the refresh token
  const newRefreshToken = generateRefreshToken();
  user.refreshToken = hashToken(newRefreshToken);
  await saveUser(user);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

// Logging out the user
const logoutUser = async ({ refreshToken }) => {
  if (!refreshToken) throw new ApiError(400, "Refresh token required...");

  const refreshHash = hashToken(refreshToken);

  const user = await findUserByRefreshTokenHash(refreshHash);

  if (!user) return true;

  user.refreshToken = null;
  await saveUser(user);

  return true;
}

module.exports = { registerUser, loginUser, refreshTokens, logoutUser };