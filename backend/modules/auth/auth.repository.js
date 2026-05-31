const UserModel = require('../users/user.model.js');

const findUserByEmail = (email) => {
  return UserModel.findOne({ email })
};

const findUserByRefreshTokenHash = (refreshTokenHash) => {
  return UserModel.findOne({ refreshToken: refreshTokenHash });
}

const createUser = (userData) => {
  return UserModel.create(userData);
};

const saveUser = (user) => {
  return user.save();
};

module.exports = { findUserByEmail, createUser, findUserByRefreshTokenHash, saveUser };