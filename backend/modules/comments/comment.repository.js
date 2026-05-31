// File Imports
const CommentModel = require('./comment.model.js');

// Create A New Comment
const createComment = (data) => {
  return CommentModel.create(data);
};

// Find All Comments On That Task
const findCommentsById = (taskId) => {
  return CommentModel.find({ taskId, isDeleted: false }).sort({ createdAt: -1 });
};

// Find Specific Comment
const findCommentById = (commentId) => {
  return CommentModel.findById(commentId);
};

// Delete Comment
const deleteCommentById = (commentId) => {
  return CommentModel.findByIdAndUpdate(commentId, { isDeleted: true }, { new: true });
};

module.exports = {
  createComment,
  findCommentsById,
  findCommentById,
  deleteCommentById
};