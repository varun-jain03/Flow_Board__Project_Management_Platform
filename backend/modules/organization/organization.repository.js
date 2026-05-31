// File Imports
const OrganizationModel = require('./organization.model.js');

const createOrganizations = (data) => {
  return OrganizationModel.create(data);
};

const findOrgById = (id) => {
  return OrganizationModel.findById(id);
};

const findOrgBySlug = (slug) => {
  return OrganizationModel.findOne({ slug });
};

module.exports = { createOrganizations, findOrgById, findOrgBySlug };