const mongoose = require("mongoose");
const { Schema } = mongoose;

const labBookingSchema = new Schema({
  labTest: { type: Schema.Types.ObjectId, ref: "LabTest", required: true },

  patientName: { type: String, required: true, trim: true },
  patientEmail: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  age: { type: Number, min: 0, max: 125 },
  gender: { type: String, enum: ["Male", "Female", "Other"] },

  appointmentDate: { type: Date, required: true },
  timeSlot: { type: String },

  address: { type: String },
  notes: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
    default: "Pending",
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

labBookingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("LabBooking", labBookingSchema);
