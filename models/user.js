const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const DoctorDetail = require("./doctorDetails");

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: {
    type: String,
  },
  emailId: {
    type: String,
    unique: true,
  },
  entryType: {
    type: String,
    enum: ["patient", "doctor"],
  },
  image: {
    path: String,
    filename: String,
  },
  doctorDetails: {
    type: Schema.Types.ObjectId,
    ref: "DoctorDetail",
  },
  appointments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
