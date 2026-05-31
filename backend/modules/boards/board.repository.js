// File Imports
const BoardModel = require('./board.model.js');


// Create Board
const createBoard = (data) => {
  return BoardModel.create(data);
};

// Finding Boards By WorkspaceId
const findBoardsByWorkspace = ({ workspaceId, organizationId }) => {
  return BoardModel.find({
    workspaceId,
    isArchived: false
  }).sort({ createdAt: -1 });
};

// Finding Single Board With BoardId
const findBoardById = (boardId) => {
  return BoardModel.findById(boardId);
};

// Finding Board By Name, WorkspaceId And OrganizationId
const findBoardByNameAndWorkspace = ({ name, workspaceId, organizationId }) => {
  return BoardModel.findOne({
    name,
    workspaceId,
    organizationId,
  });
};

// Finding Board By BoardId, WorkspaceId And OrganizationId 
const findBoardByIdWorkspaceAndOrganization = ({ boardId, workspaceId, organizationId }) => {
  return BoardModel.findOne({
    _id: boardId,
    workspaceId,
    organizationId,
  });
};

// Updating Board
const updateBoardById = ({ boardId, updateData }) => {
  return BoardModel.findByIdAndUpdate(boardId, updateData, { new: true });
};

// Archiving Board
const archiveBoardById = ({ boardId, isArchived }) => {
  return BoardModel.findByIdAndUpdate(
    boardId,
    { $set: { isArchived } },
    { new: true }
  );
};

// Delete Board By Id
const deleteBoardById = (boardId) => {
  return BoardModel.findByIdAndDelete(boardId);
};




module.exports = {
  createBoard,
  findBoardsByWorkspace,
  findBoardById,
  findBoardByNameAndWorkspace,
  findBoardByIdWorkspaceAndOrganization,
  updateBoardById,
  archiveBoardById,
  deleteBoardById
}