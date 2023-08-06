const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: {
    type: String,
  },
  emailId: {
    type: String,
    unique: true,
  },
  image: {
    type: String,
  },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
