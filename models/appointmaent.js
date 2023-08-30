const mongoose = require("mongoose");
const { Schema } = mongoose;

const appointmaentSchema = new Schema(
  {
    doctorId: String,
    doctorName: String,
    doctorAvatar: String,
    location: String,
    name: String,
    email: String,
    phone: String,
    date: String,
    timeslot: String,
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmaentSchema);
module.exports = Appointment;
