import mongoose, { Schema } from "mongoose";

const CustomFieldSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true }
  },
  { _id: false }
);

const TemplateSchema = new Schema(
  {
    // ===== TEMPLATE META =====
    templateName: {
      type: String,
      required: true
    },

    templateType: {
      type: String,
      enum: ["VISA", "ADMIT_CARD", "PASS", "CUSTOM"],
      default: "CUSTOM"
    },

    // ===== CORE DATA (COMMON) =====
    fullName: String,
    phone: String,
    address: String,

    // ===== DOCUMENT / VISA DATA =====
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

    // ===== FLEXIBLE EXTRA DATA =====
    dynamicData: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {}
    },

    // ===== CUSTOM FIELDS (LABEL + VALUE) =====
    customFields: {
      type: [CustomFieldSchema],
      default: []
    },

    // ===== TEMPLATE DESIGN INFO =====
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

export default mongoose.model("Template", TemplateSchema);
