// File Import
const ApiError = require('../utils/ApiError.js');

const requireOrgContext = (req, res, next) => {
  console.log(req.user)
  if (!req.user?.orgId) {
    return next(new ApiError(400, "Organization Context Missing. Switch Organization First..."));
  }
  next();
}

module.exports = requireOrgContext;