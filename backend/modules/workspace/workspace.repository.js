// File Import
const WorkspaceModel = require('./workspace.model.js');

// Create Workspace
const createWorkspace = (data) => {
  return WorkspaceModel.create(data);
};

// Find All Workspaces By Organization
const findWorkspacesByOrganization = (organizationId) => {
  return WorkspaceModel.find({ 
    organizationId,
    isArchived: false
   }).sort({ createdAt: -1 });
};

// Find Workspace By Id
const findWorkspaceById = (workspaceId) => {
  return WorkspaceModel.findById(workspaceId);
};

// Find The Workspace By Name In The Same Organization
const findWorkspaceByNameAndOrganization = ({ name, organizationId }) => {
  return WorkspaceModel.findOne({ name, organizationId });
};

// Find Workspace By WorkspaceId And OrganizationId
const findWorkspaceByIdAndOrganization = ({ workspaceId, organizationId }) => {
  return WorkspaceModel.findOne({
    _id: workspaceId,
    organizationId,
    isArchived: false
  });
}

// Updating The Workspace Data
const updateWorkspaceById = ({ workspaceId, updateData }) => {
  return WorkspaceModel.findByIdAndUpdate(workspaceId, updateData, { new: true });
};

// Archive Workspace
const archivedWorkspace = ({ workspaceId, isArchived }) => {
  return WorkspaceModel.findByIdAndUpdate(
    workspaceId,
    { $set: { isArchived } },
    { new: true }
  );
};

// Delete Workspace
const deleteWorkspace = (workspaceId) => {
  return WorkspaceModel.findByIdAndDelete(workspaceId);
};

module.exports = {
  createWorkspace,
  findWorkspacesByOrganization,
  findWorkspaceById,
  findWorkspaceByNameAndOrganization,
  findWorkspaceByIdAndOrganization,
  updateWorkspaceById,
  archivedWorkspace,
  deleteWorkspace
};