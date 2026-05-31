// File Imports
const MembershipModel = require('./membership.model.js');

const createMemberships = (data) => {
  return MembershipModel.create(data);
};

const findMembership = ({ userId, organizationId }) => {
  return MembershipModel.findOne({ userId, organizationId });
};

const findUserMembership = (userId) => {
  return MembershipModel.find({ userId, status: "active" }).populate("organizationId");
};

const findOrgMembership = (organizationId) => {
  return MembershipModel.find({ organizationId }).populate("userId", "name email");
};

const updateMembershipRole = ({ userId, organizationId, role }) => {
  return MembershipModel.findOneAndUpdate(
    { userId, organizationId },
    { role },
    { new: true }
  );
};

const deleteMembership = ({ userId, organizationId }) => {
  return MembershipModel.deleteOne({ userId, organizationId });
};

module.exports = { 
  createMemberships,
  findMembership, 
  findUserMembership, 
  findOrgMembership, 
  updateMembershipRole, 
  deleteMembership 
};