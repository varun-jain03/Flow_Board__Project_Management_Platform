// Dependencies
const mongoose = require("mongoose");

// File Imports
const {
  createBoard,
  findBoardsByWorkspace,
  findBoardById,
  findBoardByNameAndWorkspace,
  findBoardByIdWorkspaceAndOrganization,
  updateBoardById,
  archiveBoardById,
  deleteBoardById
} = require('./board.repository.js');
const ApiError = require('../../utils/ApiError.js');
const { findWorkspaceByIdAndOrganization } = require('../workspace/workspace.repository.js');
const { logActivity } = require("../activity/activity.service.js");

// Create Board
const createNewBoard = async ({
  name,
  description,
  workspaceId,
  organizationId,
  createdBy
}) => {
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new ApiError(400, "Invalid Resource ID...");
  };

  if (!name || !name.trim()) {
    throw new ApiError(400, "Board Name Is Required...");
  };

  const workspace = await findWorkspaceByIdAndOrganization({
    workspaceId,
    organizationId
  });
  if (!workspace) {
    throw new ApiError(404, "Workspace Not Found...");
  };

  const existingBoard = await findBoardByNameAndWorkspace({
    name: name.trim(),
    description: description?.trim() || "",
    workspaceId,
    organizationId,
    createdBy
  });
  if (existingBoard && !existingBoard.isArchived) {
    throw new ApiError(409, "Board With This Name Already Existing In This Workspace...");
  };

  const board = await createBoard({
    name: name.trim(),
    description: description?.trim() || "",
    workspaceId,
    organizationId,
    createdBy
  });

  await logActivity({
    action: "BOARD_CREATED",
    entityType: "board",
    entityId: board._id,
    organizationId,
    workspaceId,
    performedBy: createdBy,
    metadata: { name: board.name }
  });

  return board;
};

// Get Boards By Workspace
const getWorkspaceBoard = async ({ workspaceId, organizationId }) => {
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new ApiError(400, "Invalid Resouce ID...");
  };

  const workspace = await findWorkspaceByIdAndOrganization({
    workspaceId,
    organizationId
  });
  if (!workspace) {
    throw new ApiError(404, "Workspace Not Found...");
  };
  const boards = findBoardsByWorkspace({ workspaceId, organizationId });
  return boards;
};

// Get Single Board By Id
const getBoardById = async ({ boardId, workspaceId, organizationId }) => {
  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw new ApiError(400, "Invalid Resouce ID...");
  };

  const board = await findBoardByIdWorkspaceAndOrganization({
    boardId,
    workspaceId,
    organizationId
  });
  console.log(board);
  if (!board) {
    throw new ApiError(404, "Board Not Found...");
  };

  return board;
};

// Update Board
const updateBoard = async ({ boardId, workspaceId, organizationId, updateData, performedBy }) => {
  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw new ApiError(400, "Invalid Resouce ID...");
  };

  const board = await findBoardByIdWorkspaceAndOrganization({
    boardId,
    workspaceId,
    organizationId
  });
  if (!board) {
    throw new ApiError(404, "Board Not Found...");
  };

  if (updateData.name !== undefined && !updateData.name.trim()) {
    throw new ApiError(400, "Board Name Can Not Be Empty...");
  };

  const updatedBoard = await updateBoardById({
    boardId,
    updateData: {
      ...(updateData.name !== undefined && { name: updateData.name.trim() }),
      ...(updateData.description !== undefined && { description: updateData.description.trim() })
    }
  });

  await logActivity({
    action: "BOARD_UPDATED",
    entityType: "board",
    entityId: boardId,
    organizationId,
    workspaceId,
    performedBy,
    metadata: updateData
  });

  return updatedBoard;
}

// Archive Board
const archiveBoard = async ({ boardId, workspaceId, organizationId, isArchived, performedBy }) => {
  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw new ApiError(400, "Invalid Resouce ID...");
  };
  if (isArchived !== false && isArchived !== true) {
    throw new ApiError(400, "isArchive Must Be True Or False...");
  };

  const board = await findBoardByIdWorkspaceAndOrganization({
    boardId,
    workspaceId,
    organizationId
  });
  console.log(boardId, workspaceId, organizationId);
  console.log(board);
  if (!board) {
    throw new ApiError(404, "Board Not Found...");
  };

  await archiveBoardById({ boardId, isArchived });

  await logActivity({
    action: "BOARD_ARCHIVED",
    entityType: "board",
    entityId: boardId,
    organizationId,
    workspaceId,
    performedBy,
    metadata: { isArchived }
  });

  return true;
};

// Delete Board
const removeBoard = async ({ boardId, workspaceId, organizationId, performedBy }) => {
  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw new ApiError(400, "Invalid resource ID...");
  }

  const board = await findBoardByIdWorkspaceAndOrganization({
    boardId,
    workspaceId,
    organizationId,
  });
  if (!board) {
    throw new ApiError(404, "Board Not Found...");
  }

  await deleteBoardById(boardId);

  await logActivity({
    action: "BOARD_DELETED",
    entityType: "board",
    entityId: boardId,
    organizationId,
    workspaceId,
    performedBy
  });

  return true;
};




module.exports = {
  createNewBoard,
  getWorkspaceBoard,
  getBoardById,
  updateBoard,
  archiveBoard,
  removeBoard
};