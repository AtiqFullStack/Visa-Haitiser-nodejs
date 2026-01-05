import mongoose, { Schema } from "mongoose";

const QrCodeSchema = new Schema(
  {
    // Actual QR Data
    data: {
      type: String,
      required: true,
      trim: true,
    },

    // Full QR Styling Config (from frontend)
    options: {
      type: Object,
      required: true,
    },

    // Optional: who created this QR
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // ya "User"
      required: false,
    },

    // Analytics
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

export default mongoose.model("QrCode", QrCodeSchema);
