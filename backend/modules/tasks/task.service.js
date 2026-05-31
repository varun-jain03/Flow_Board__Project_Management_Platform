// Dependencies
const mongoose = require("mongoose");

// File Imports
const {
  createTask,
  findTasksByBoard,
  countTasks,
  findTaskById,
  findTaskByIdBoardWorkspaceAndOrganization,
  updateTaskById,
  deleteTaskById
} = require('./task.repository.js');
const ApiError = require('../../utils/ApiError.js');
const { findBoardByIdWorkspaceAndOrganization } = require('../boards/board.repository.js');
const { findMembership } = require('../membership/membership.repository.js');
const { logActivity } = require('../activity/activity.service.js');

// Creating New Task
const createNewTask = async ({
  title,
  description,
  boardId,
  workspaceId,
  organizationId,
  createdBy,
  assignedTo,
  status,
  priority,
  dueDate
}) => {
  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw new ApiError(400, "Invalid Resource ID...");
  };
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new ApiError(400, "Invalid Resource ID...");
  };
  if (!title || !title.trim()) {
    throw new ApiError(400, "Task Title Is Required...");
  };

  if (assignedTo) {
    const membership = await findMembership({
      userId: assignedTo,
      organizationId
    });

    if (!membership) {
      throw new ApiError(400, "User is not part of this organization...");
    }
  }

  const board = await findBoardByIdWorkspaceAndOrganization({
    boardId,
    workspaceId,
    organizationId
  });

  if (!board) {
    throw new ApiError(404, "Board Not Found...");
  };


  const task = await createTask({
    title: title.trim(),
    description: description?.trim(),
    boardId,
    workspaceId,
    organizationId,
    createdBy,
    assignedTo: assignedTo || null,
    status: status || "todo",
    priority: priority || "medium",
    dueDate: dueDate || null
  });

  await logActivity({
    action: "TASK_CREATED",
    entityType: "task",
    entityId: task._id,
    organizationId,
    workspaceId,
    boardId,
    performedBy: createdBy,
    metadata: {
      title: task.title
    }
  });

  return task;
}

// Get All The Tasks
// const getBoardTasks = async ({ boardId, workspaceId, organizationId }) => {
//   if (!mongoose.Types.ObjectId.isValid(boardId)) {
//     throw new ApiError(400, "Invalid Resource ID...");
//   };
//   if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
//     throw new ApiError(400, "Invalid Resource ID...");
//   };

//   const board = await findBoardByIdWorkspaceAndOrganization({
//     boardId,
//     workspaceId,
//     organizationId
//   });
//   if (!board) {
//     throw new ApiError(404, "Board Not Found...");
//   };

//   return findTasksByBoard({ boardId, workspaceId, organizationId });
// };
const getBoardTasks = async ({
  boardId,
  workspaceId,
  organizationId,
  page = 1,
  limit = 10
}) => {
  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw new ApiError(400, "Invalid Resource ID...");
  }
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new ApiError(400, "Invalid Resource ID...");
  }

  const board = await findBoardByIdWorkspaceAndOrganization({
    boardId,
    workspaceId,
    organizationId
  });
  if (!board) {
    throw new ApiError(404, "Board Not Found...");
  }

  const tasks = await findTasksByBoard({
    boardId,
    workspaceId,
    organizationId,
    page,
    limit
  });
  const total = await countTasks({
    boardId,
    workspaceId,
    organizationId
  });
  return {
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

// Get Single Tasks
const getTaskById = async ({ taskId, boardId, workspaceId, organizationId }) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid Resource ID...");
  };
  const task = await findTaskByIdBoardWorkspaceAndOrganization({
    taskId,
    boardId,
    workspaceId,
    organizationId
  });

  if (!task) {
    throw new ApiError(404, "Task Not Found...");
  };

  return task;
}

// Update The Task
const updateTask = async ({ taskId, boardId, workspaceId, organizationId, updateData, performedBy }) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid Resource ID...");
  }

  const task = await findTaskByIdBoardWorkspaceAndOrganization({
    taskId,
    boardId,
    workspaceId,
    organizationId
  });

  if (!task) {
    throw new ApiError(404, "Task not found...");
  }

  if (updateData.title !== undefined && !updateData.title.trim()) {
    throw new ApiError(400, "Task title can not be empty...");
  }

  const updatedTask = await updateTaskById({
    taskId,
    updateData: {
      ...(updateData.title !== undefined && { title: updateData.title.trim() }),
      ...(updateData.description !== undefined && { description: updateData.description.trim() }),
      ...(updateData.assignedTo !== undefined && { assignedTo: updateData.assignedTo }),
      ...(updateData.status !== undefined && { status: updateData.status }),
      ...(updateData.priority !== undefined && { priority: updateData.priority }),
      ...(updateData.dueDate !== undefined && { dueDate: updateData.dueDate })
    }
  });

  await logActivity({
    action: "TASK_UPDATED",
    entityType: "task",
    entityId: taskId,
    organizationId,
    workspaceId,
    boardId,
    performedBy,
    metadata: updateData
  });

  return updatedTask;
};

// Delete Task
const removeTask = async ({ taskId, boardId, workspaceId, organizationId, performedBy }) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid Resource ID...");
  }

  const task = await findTaskByIdBoardWorkspaceAndOrganization({
    taskId,
    boardId,
    workspaceId,
    organizationId
  });

  if (!task) {
    throw new ApiError(404, "Task Not Found...");
  }

  await deleteTaskById(taskId);

  await logActivity({
    action: "TASK_DELETED",
    entityType: "task",
    entityId: taskId,
    organizationId,
    workspaceId,
    boardId,
    performedBy
  });

  return true;
};


module.exports = { createNewTask, getBoardTasks, getTaskById, updateTask, removeTask };