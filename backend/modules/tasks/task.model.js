// Dependencies
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    dueDate: {
      type: Date,
      default: null
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boards",
      required: true,
      index: true
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspaces",
      required: true,
      index: true
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizations",
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null
    }
  },
  { timestamps: true }
);

taskSchema.index(
  { title: 1, boardId: 1 },
  { unique: true }
);

const TaskModel = mongoose.model("Tasks", taskSchema);

module.exports = TaskModel;