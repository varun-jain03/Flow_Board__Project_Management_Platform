// Dependencies
const { mongoose } = require("mongoose");
const { required } = require("zod/mini");

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true
    },
    entityType: {
      type: String,
      enum: ["workspace", "board", "task", "member", "organization"],
      required: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizations",
      required: true,
      index: true
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspaces",
      default: null
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boards",
      default: null
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

activitySchema.index({ organizationId: 1, createdAt: -1 });

const ActivityModel = mongoose.model("Activities", activitySchema);

module.exports = ActivityModel;