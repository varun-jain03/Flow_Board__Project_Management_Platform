// Dependencies
const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, trim: true, lowercase: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }
}, { timestamps: true });

const OrganizationModel = mongoose.model("Organizations", organizationSchema);

module.exports = OrganizationModel;