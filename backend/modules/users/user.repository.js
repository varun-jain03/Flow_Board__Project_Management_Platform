// File import
const UserModel = require("./user.model.js");

const findUserByEmail = (email) => {
  return UserModel.findOne({ email: String(email).trim().toLowerCase() });
};

module.exports = { findUserByEmail };