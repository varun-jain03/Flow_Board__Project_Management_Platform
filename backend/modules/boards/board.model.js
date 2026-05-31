// Dependencies
const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

boardSchema.index(
  { name: 1, workspaceId: 1, isArchived: 1 },
  { unique: true }
);

const BoardModel = mongoose.model("Boards", boardSchema);

module.exports = BoardModel;