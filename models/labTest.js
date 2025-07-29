const mongoose = require("mongoose");
const { Schema } = mongoose;

const labTestSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, trim: true, default: "General" },
    price: { type: Number, required: true, min: 0 },
    preparation: { type: String, trim: true, default: "" },
    duration: { type: String, trim: true, default: "" },
    sampleType: { type: String, trim: true, default: "Blood" },
    fastingRequired: { type: Boolean, default: false },
    availability: {
      weekdays: { type: [String], default: [] }, // e.g. ["Monday", "Wednesday"]
      timing: { type: String, default: "" }, // e.g. "8am - 4pm"
    },
    labName: { type: String, trim: true, default: "CareData Lab" },
    logoUrl: { type: String, trim: true }, // optional logo image
    typicalResultsTime: { type: String, trim: true, default: "24-48 hours" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LabTest", labTestSchema);
