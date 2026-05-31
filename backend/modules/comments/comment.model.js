// Dependencies
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tasks",
      required: true,
      index: true
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ovrganizations",
      required: true,
      index: true
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspaces",
      requried: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boards",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

commentSchema.index({ taskId: 1, createdAt: -1 });

const CommentModel = mongoose.model("Comments", commentSchema);

module.exports = CommentModel;