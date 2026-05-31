// File Imports
const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const { 
  createNewWorkspace, 
  getOrganizationWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  archiveWorkspace,
  deletingWorkspace
} = require('./workspace.service.js');


// Create Workspace
const create = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const workspace = await createNewWorkspace({
    name,
    description,
    organizationId: req.user.orgId,
    createdBy: req.user.userId
  });

  res.status(201).json(new ApiResponse(201, workspace, "Workspace Created Successfully..."));
});

// Get All Workspace Of Current Organization
const getAll = asyncHandler(async (req, res) => {
  const workspaces = await getOrganizationWorkspaces({ organizationId: req.user.orgId });
  res.status(200).json(new ApiResponse(200, workspaces, "Workspaces Fetched Successfully..."));
})

// Get Single Workspace By OrganizationId And WorkspaceId
const getOne = asyncHandler(async (req, res) => {
  const workspace = await getWorkspaceById({
    workspaceId: req.params.workspaceId,
    organizationId: req.user.orgId
  });

  res.status(200).json(new ApiResponse(200, workspace, "Workspace Fetched Successfully..."));
});

// Updating The Workspace
const update = asyncHandler(async (req, res) => {
  const workspace = await updateWorkspace({
    workspaceId: req.params.workspaceId,
    organizationId: req.user.orgId,
    updateData: req.body,
    performedBy: req.user.userId
  });

  res.status(200).json(new ApiResponse(200, workspace, "Workspace Has Been Updated..."));
});

// Archive
const archive = asyncHandler(async (req, res) => {
  const result = await archiveWorkspace({
    workspaceId: req.params.workspaceId,
    organizationId: req.user.orgId,
    isArchived: req.body.isArchived,
    performedBy: req.user.userId
  });

  res.status(200).json(new ApiResponse(200, result, "Workspace Archived Status Has Been Updated..."));
});

//Deleting Workspace
const remove = asyncHandler(async (req, res) => {
  await deletingWorkspace({
    workspaceId: req.params.workspaceId,
    organizationId: req.user.orgId,
    performedBy: req.user.userId
  });

  res.status(200).json(new ApiResponse(200, null, "Workspace Has Been Deleted..."));
});

module.exports = { 
  create,
  getAll,
  getOne,
  update,
  archive,
  remove
};