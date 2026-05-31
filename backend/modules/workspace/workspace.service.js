// Dependencies
const mongoose = require("mongoose");

// File Import
const ApiError = require('../../utils/ApiError.js');
const {
  createWorkspace,
  findWorkspacesByOrganization,
  findWorkspaceById,
  findWorkspaceByNameAndOrganization,
  findWorkspaceByIdAndOrganization,
  updateWorkspaceById,
  archivedWorkspace,
  deleteWorkspace
} = require('./workspace.repository.js');
const { logActivity } = require("../activity/activity.service.js");


// Create New Workspace
const createNewWorkspace = async ({ name, description, organizationId, createdBy }) => {
  if (!name || !name.trim()) {
    throw new ApiError(400, "Workspace Name Is Required...");
  };

  const existingWorkspace = await findWorkspaceByNameAndOrganization({
    name: name.trim(),
    organizationId
  });
  console.log(existingWorkspace);
  if (existingWorkspace && !existingWorkspace.isArchived) {
    throw new ApiError(409, "Workspace With This Name Already Exists In This Organization...");
  };

  const workspace = await createWorkspace({
    name: name.trim(),
    description: description?.trim() || "",
    organizationId,
    createdBy
  });

  await logActivity({
    action: "WORKSPACE_CREATED",
    entityType: "workspace",
    entityId: workspace._id,
    organizationId,
    performedBy: createdBy
  });
  return workspace;
};

// Get All Workspace Of Current Organization
const getOrganizationWorkspaces = async ({ organizationId }) => {
  return findWorkspacesByOrganization(organizationId);
};

// Get Single Workspace By OrganizationId And Workspace id
const getWorkspaceById = async ({ organizationId, workspaceId }) => {
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new ApiError(400, "Invalid resource ID...");
  };
  const workspace = await findWorkspaceById(workspaceId);
  if (!workspace || workspace.isArchived) {
    throw new ApiError(404, "Workspace Not Found...");
  };

  if (String(workspace.organizationId) !== String(organizationId)) {
    throw new ApiError(403, "You Are Not Allowed To Access This Workspace");
  };

  return workspace;
};

// Update Workspace
const updateWorkspace = async ({ workspaceId, organizationId, updateData, performedBy }) => {
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new ApiError(400, "Invalid resource ID...");
  };

  const workspace = await findWorkspaceByIdAndOrganization({ workspaceId, organizationId });
  if (!workspace || workspace.isArchived) {
    throw new ApiError(404, "Workspace Not Found...");
  };

  if (updateData.name !== undefined && !updateData.name.trim()) {
    throw new ApiError(400, "Workspace Name Can Not Be Empty...");
  };

  const updatedWorkspace = await updateWorkspaceById({
    workspaceId,
    updateData: {
      ...(updateData.name !== undefined && { name: updateData.name.trim() }),
      ...(updateData.description !== undefined && {
        description: updateData.description.trim(),
      }),
    },
  });

  await logActivity({
    action: "WORKSPACE_UPDATED",
    entityType: "workspace",
    entityId: workspaceId,
    organizationId,
    performedBy,
    metadata: updateData
  });

  return updatedWorkspace;
};

// Archive Workspace
const archiveWorkspace = async ({ workspaceId, organizationId, isArchived, performedBy }) => {
  if (isArchived !== false && isArchived !== true) {
    console.log(isArchived);
    console.log(typeof isArchived);
    throw new ApiError(400, "isArchived Must Be True Or False...");
  };

  const workspace = await findWorkspaceById(workspaceId);
  if (!workspace) {
    throw new ApiError(404, "Workspace Not Found...");
  };

  if (String(workspace.organizationId) !== String(organizationId)) {
    throw new ApiError(403, "You Are Not Allowed To Delete This Workspace...");
  };

  await archivedWorkspace({ workspaceId, isArchived });

  await logActivity({
    action: "WORKSPACE_ARCHIVED",
    entityType: "workspace",
    entityId: workspaceId,
    organizationId,
    performedBy,
    metadata: { isArchived }
  });

  return true;
};

// Deleting The Workspace
const deletingWorkspace = async ({ workspaceId, organizationId, performedBy }) => {
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new ApiError(400, "Invalid resource ID");
  }

  const existingWorkspace = await findWorkspaceByIdAndOrganization({
    workspaceId,
    organizationId,
  });
  if (!existingWorkspace) {
    throw new ApiError(404, "Workspace Not Found...");
  };

  await deleteWorkspace(workspaceId);

  await logActivity({
    action: "WORKSPACE_DELETED",
    entityType: "workspace",
    entityId: workspaceId,
    organizationId,
    performedBy
  });

  return true;
};

module.exports = {
  createNewWorkspace,
  getOrganizationWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  archiveWorkspace,
  deletingWorkspace
};