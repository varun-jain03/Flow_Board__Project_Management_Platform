// File Imports
const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const {
  createNewComment,
  GetTaskComments,
  removeComment
} = require('./comment.service.js');

// Create Comment
const create = asyncHandler(async (req, res) => {
  const { content, taskId, boardId, workspaceId, parentCommentId } = req.body;

  const comment = await createNewComment({
    content,
    taskId,
    boardId,
    workspaceId,
    parentCommentId,
    organizationId: req.user.orgId,
    createdBy: req.user.userId
  });

  res.status(200).json(new ApiResponse(200, comment, "New Comment Created..."));
});

// Get All Comments 
const getAll = asyncHandler(async (req, res) => {
  const comments = await GetTaskComments({taskId: req.params.taskId});
  res.status(200).json(new ApiResponse(200, comments, "Comments Fetched Successfully..."));
});

// Delete Comment
const remove = asyncHandler(async (req, res) => {
  await removeComment({
    commentId: req.params.commentId,
    organizationId: req.user.orgId,
    performedBy: req.user.userId
  });
  res.status(200).json(new ApiResponse(200, null, "Comment Deleted..."));
});
 


module.exports = { create, getAll, remove };