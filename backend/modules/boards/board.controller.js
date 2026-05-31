// File Imports
const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const {
  createNewBoard,
  getWorkspaceBoard,
  getBoardById,
  updateBoard,
  archiveBoard,
  removeBoard
} = require('./board.service.js');


// Create Board
const create = asyncHandler(async (req, res) => {
  const { name, description, workspaceId } = req.body;
  const board = await createNewBoard({
    name,
    description,
    workspaceId,
    organizationId: req.user.orgId,
    createdBy: req.user.userId
  });

  res.status(201).json(new ApiResponse(201, board, "Board Created Successfully..."));
});

// Get All Boards By Id
const getAll = asyncHandler(async (req, res) => {
  const boards = await getWorkspaceBoard({
    workspaceId: req.params.workspaceId,
    organizationId: req.user.orgId
  });

  res.status(200).json(new ApiResponse(200, boards, "Boards Fetched Successfully..."));
});

// Get Single Board By Id
const getOne = asyncHandler(async (req, res) => {
  const board = await getBoardById({
    boardId: req.params.boardId,
    workspaceId: req.params.workspaceId,
    organizationId: req.user.orgId
  });

  res.status(200).json(new ApiResponse(200, board, "Board Fetched Successfully..."));
});

// Update Board
const update = asyncHandler(async (req, res) => {
  const board = await updateBoard({
    boardId: req.params.boardId,
    workspaceId: req.params.workspaceId,
    organizationId: req.user.orgId,
    updateData: req.body,
    performedBy: req.user.userId
  });
  res.status(200).json(new ApiResponse(200, board, "Board Has Been Updated Successfully..."));
});

// Archiving The Board
const archive = asyncHandler(async (req, res) => {
  const result = await archiveBoard({
    boardId: req.params.boardId,
    workspaceId: req.params.workspaceId,
    organizationId: req.user.orgId,
    isArchived: req.body.isArchived,
    performedBy: req.user.userId
  });
  res.status(200).json(new ApiResponse(200, result, "Board Archive Status Has Been Updated..."));
});

// Delete Board
const remove = asyncHandler(async (req, res) => {
  await removeBoard({
    boardId: req.params.boardId,
    workspaceId: req.params.workspaceId,
    organizationId: req.user.orgId,
    performedBy: req.user.userId
  });

  res.status(200).json(new ApiResponse(200, null, "Board Deleted Successfully..."));
});

module.exports = { create, getAll, getOne, update, archive, remove };