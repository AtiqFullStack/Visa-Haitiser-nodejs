const mongoose = require('mongoose');
const { Schema } = mongoose;

const CustomFieldSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true }
  },
  { _id: false }
);

const TemplateSchema = new Schema(
  {
    templateName: {
      type: String,
      required: true
    },
    templateType: {
      type: String,
      enum: ["VISA", "ADMIT_CARD", "PASS", "CUSTOM"],
      default: "CUSTOM"
    },
    fullName: String,
    phone: String,
    address: String,
    visaNumber: String,
    placeOfIssuing: String,
    issueDate: String,
    expiryDate: String,
    duration: String,
    documentNumber: String,
    nationality: String,
    sex: String,
    dateOfBirth: String,
    issuingAuthority: String,
    processNumber: String,
    dynamicData: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {}
    },
    customFields: {
      type: [CustomFieldSchema],
      default: []
    },
    templateVersion: {
      type: Number,
      default: 1
    },
    qrData: {
      type: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Template", TemplateSchema);
