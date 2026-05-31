// File Imports
const TaskModel = require('./task.model.js');

// Create Tasks
const createTask = (data) => {
  return TaskModel.create(data);
};

// Finding All The Tasks Inside Board 
const findTasksByBoard = ({ boardId, workspaceId, organizationId, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  return TaskModel.find({
    boardId,
    workspaceId,
    organizationId
  })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
};

// Count Of All The Task
const countTasks = ({ boardId, workspaceId, organizationId }) => {
  return TaskModel.countDocuments({
    boardId,
    workspaceId,
    organizationId,
    isArchived: false
  });
};

// Finding Single Task 
const findTaskById = (taskId) => {
  return TaskModel.findById(taskId);
};

// Find Task By Id Board Workspace And Organization
const findTaskByIdBoardWorkspaceAndOrganization = ({
  taskId,
  boardId,
  workspaceId,
  organizationId
}) => {
  return TaskModel.findOne({
    _id: taskId,
    boardId,
    workspaceId,
    organizationId
  });
};

// Update Task By Id
const updateTaskById = ({ taskId, updateData }) => {
  return TaskModel.findByIdAndUpdate(taskId, updateData, { new: true });
};

// Delete By Id
const deleteTaskById = (taskId) => {
  return TaskModel.findByIdAndDelete(taskId);
};

module.exports = {
  createTask,
  findTasksByBoard,
  countTasks,
  findTaskById,
  findTaskByIdBoardWorkspaceAndOrganization,
  updateTaskById,
  deleteTaskById
};