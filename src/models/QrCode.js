const mongoose = require('mongoose');
const { Schema } = mongoose;

const QrCodeSchema = new Schema(
  {
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    scanCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QrCode", QrCodeSchema);
