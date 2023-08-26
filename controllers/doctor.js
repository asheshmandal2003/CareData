const User = require("../models/user");
const DoctorDetails = require("../models/doctorDetails");

module.exports.doctors = async (req, res, next) => {
  try {
    const doctors = await User.find({}).populate("doctorDetails");
    res.render("doctor/findDoctors", { doctors });
  } catch (error) {
    next(error);
  }
};

module.exports.doctorProfile = async (req, res, next) => {
  try {
    const doctor = await User.findById(req.params.id).populate("doctorDetails");
    res.render("doctor/doctorProfile", { doctor });
  } catch (error) {
    next(error);
  }
};

module.exports.addDetailsPage = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("doctor/addDoctorDetails", { user });
  } catch (error) {
    next(error);
  }
};

module.exports.addDetails = async (req, res, next) => {
  try {
    const doctorDetails = new DoctorDetails(req.body);
    const user = await User.findById(req.params.id);
    user.doctorDetails = doctorDetails;
    await doctorDetails.save();
    await user.save();
    req.flash("success", "Your details has been added :)");
    res.redirect(`/caredata/users/${req.params.id}`);
  } catch (error) {
    req.flash("error", "Can't add the details :(");
    next(error);
  }
};
