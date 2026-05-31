// File Import
const ApiError = require('../utils/ApiError.js');

const requireOrgRole = (allowedRoles = []) => {
  return (req, res, next) => {
    console.log("req.user in requireOrgRole =>", req.user);
    console.log("allowedRoles =>", allowedRoles);
    console.log("current role =>", req.user?.orgRole);
    const role = req.user?.orgRole;
    if (!role || !allowedRoles.includes(role)) {
      return next(new ApiError(403, "Forbidden..."));
    }
    next();
  };
};

module.exports = requireOrgRole;