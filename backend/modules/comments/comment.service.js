// Dependencies
const mongoose = require("mongoose");

// File Imports
const ApiError = require('../../utils/ApiError.js');
const {
  createComment,
  findCommentsById,
  findCommentById,
  deleteCommentById
} = require('./comment.repository.js');
const { findTaskByIdBoardWorkspaceAndOrganization } = require('../tasks/task.repository.js');
const { logActivity } = require('../activity/activity.service.js');


// Create New Comment
const createNewComment = async ({
  content,
  taskId,
  boardId,
  workspaceId,
  organizationId,
  createdBy,
  parentCommentId = null
}) => {
  if (!content || !content.trim()) {
    throw new ApiError(400, "Content Can Not Be Empty...");
  };
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid Task ID...");
  };

  const task = await findTaskByIdBoardWorkspaceAndOrganization({
    taskId,
    boardId,
    workspaceId,
    organizationId
  });
  if (!taskId) {
    throw new ApiError(404, "Task Not Found...");
  };

  const comment = await createComment({
    content: content.trim(),
    taskId,
    boardId,
    workspaceId,
    organizationId,
    createdBy,
    parentCommentId
  });
  await logActivity({
    action: parentCommentId ? "COMMENT_REPLIED" : "COMMENT_CREATED",
    entityType: "task",
    entityId: taskId,
    organizationId,
    workspaceId,
    boardId,
    boardId,
    performedBy: createdBy,
    metadata: {
      commentId: comment._id
    }
  });

  return comment;
};

// Find All the Comments
const GetTaskComments = async ({ taskId }) => {
  const comments = await findCommentsById(taskId);

  const map = {};
  const roots = [];

  comments.forEach(c => {
    map[c._id] = { ...c.toObject(), replies: [] };
  });

  comments.forEach(c => {
    if (c.parentCommentId) {
      map[c.parentCommentId]?.replies.push(map[c._id]);
    } else {
      roots.push(map[c._id]);
    }
  });

  return roots;
}

// Delete Comment
const removeComment = async ({ commentId, organizationId, performedBy }) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid Resource ID...");
  };

  const comment = await findCommentById(commentId);
  if (!comment || comment.isDeleted) {
    throw new ApiError(404, "Comment Not Found...");
  };

  if (String(comment.organizationId) !== String(organizationId)) {
    throw new ApiError(403, "You Are Unauthorized...");
  };

  await deleteCommentById(commentId);
  await logActivity({
    action: "COMMENT_DELETED",
    entityType: "task",
    entityId: comment._id,
    organizationId,
    workspaceId: comment.workspaceId,
    boardId: comment.boardId,
    performedBy,
    metadata: { commentId }
  });

  return true;
};


module.exports = {
  createNewComment,
  GetTaskComments,
  removeComment
}; 