const mongoose = require("mongoose");
const { Schema } = mongoose;

const doctorDetailsSchema = new Schema({
  education: {
    type: String,
  },
  speciality: {
    type: String,
  },
  clinicName: {
    type: String,
  },
  fees: {
    type: Number,
  },
  location: {
    type: String,
  },
  language: {
    type: String,
  },
  aboutDoctor: {
    type: String,
  },
  experience: {
    type: Number,
  },
  open: {
    type: String,
  },
  close: {
    type: String,
  },
  regId: {
    type: String
  }
});

const DoctorDetails = mongoose.model("DoctorDetail", doctorDetailsSchema);
module.exports = DoctorDetails;
