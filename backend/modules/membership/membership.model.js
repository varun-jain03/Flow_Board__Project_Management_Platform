// Dependencies
const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true, index: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organizations", required: true, index: true },
  role: {
    type: String,
    enum: [ "owner", "admin", "member" ],
    required: true,
    default: "member"
  },
  status: {
    type: String,
    enum: [ "active", "inActive"],
    default: "active"
  },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", default: null }
}, { timestamps: true });

membershipSchema.index({ userId: 1, organizationId: 1 }, { unique: true });

const MembershipModel = mongoose.model("Memberships", membershipSchema);

module.exports = MembershipModel;