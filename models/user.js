const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Upload = require("./upload");

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
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: "Upload",
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
