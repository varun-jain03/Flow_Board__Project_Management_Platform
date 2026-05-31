// File Imports
const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const {
  createNewTask,
  getBoardTasks,
  getTaskById,
  updateTask,
  removeTask
} = require('./task.service.js');


// Creating New Tasks
const create = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    boardId,
    workspaceId,
    assignedTo,
    status,
    priority,
    dueDate
  } = req.body;

  const task = await createNewTask({
    title,
    description,
    boardId,
    workspaceId,
    assignedTo,
    status,
    priority,
    dueDate,
    organizationId: req.user.orgId,
    createdBy: req.user.userId,
  });

  res.status(201).json(new ApiResponse(201, task, "New Task Has Been Created..."));
});

// Get All The Tasks
const getAll = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const tasks = await getBoardTasks({
    workspaceId: req.params.workspaceId,
    boardId: req.params.boardId,
    organizationId: req.user.orgId,
    page,
    limit
  });
  res.status(200).json(new ApiResponse(200, tasks, "Tasks Fetched Successfully..."));
});

// Get Single Task By ID
const getOne = asyncHandler(async (req, res) => {
  const task = await getTaskById({
    workspaceId: req.params.workspaceId,
    boardId: req.params.boardId,
    taskId: req.params.taskId,
    organizationId: req.user.orgId
  });
  console.log(task);
  res.status(200).json(new ApiResponse(200, task, "Task Fetched Successfully"));
});

// Update Task
const update = asyncHandler(async (req, res) => {
  const task = await updateTask({
    taskId: req.params.taskId,
    boardId: req.params.boardId,
    workspaceId: req.params.workspaceId,
    organizationId: req.user.orgId,
    updateData: req.body,
    performedBy: req.user.userId
  });

  res.status(200).json(new ApiResponse(200, task, "Task Updated Successfully..."));
});

// Delete Task
const remove = asyncHandler(async (req, res) => {
  await removeTask({
    taskId: req.params.taskId,
    boardId: req.params.boardId,
    workspaceId: req.params.workspaceId,
    organizationId: req.user.orgId,
    performedBy: req.user.userId
  });

  res.status(200).json(new ApiResponse(200, null, "Task Deleted Successfully..."));
});


module.exports = { create, getAll, getOne, update, remove };