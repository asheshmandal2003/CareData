const mongoose = require("mongoose");
const { Schema } = mongoose;

const doctorDetailsSchema = new Schema({
  education: { type: String, trim: true },
  speciality: { type: String, trim: true },
  subSpecialities: { type: [String], default: [] },
  clinicName: { type: String, trim: true },
  clinicAddress: { type: String, trim: true },
  fees: { type: Number, min: 0 },
  location: { type: String, trim: true },
  contactNumber: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  language: { type: [String], default: [] },
  aboutDoctor: { type: String, trim: true },
  experience: { type: Number, min: 0 },
  regId: { type: String, trim: true },
  awards: { type: [String], default: [] },
  certifications: { type: [String], default: [] },
  services: { type: [String], default: [] },
  consultationTypes: {
    type: [String],
    enum: ["In-Person", "Online", "Home Visit"],
    default: ["In-Person"],
  },
  clinicTimings: [
    {
      day: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      open: String,
      close: String,
    },
  ],
  socialLinks: {
    website: String,
    linkedin: String,
    facebook: String,
    twitter: String,
    instagram: String,
  },
  profilePhotoUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

doctorDetailsSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("DoctorDetail", doctorDetailsSchema);
