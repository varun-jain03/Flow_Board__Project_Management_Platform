// Dependencies
const mongoose = require("mongoose");
const { trim } = require("zod");

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizations",
      required: true,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    isArchived: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

workspaceSchema.index({ name: 1, organizationId: 1 }, { unique: true });

const WorkspaceModel = mongoose.model("Workspaces", workspaceSchema);

module.exports = WorkspaceModel;