const User = require("../models/user");
const Appointment = require("../models/appointmaent");
const moment = require("moment");

module.exports.appointmentForm = async (req, res, next) => {
  try {
    const doctor = await User.findById(req.params.id)
      .populate("doctorDetails")
      .populate("appointments");
    res.render("appointment/index", { doctor, moment });
  } catch (error) {
    next(error);
  }
};

module.exports.bookAppointment = async (req, res, next) => {
  try {
    const newAppointment = new Appointment(req.body);
    const user = await User.findById(req.params.id);
    user.appointments.push(newAppointment);
    await newAppointment.save();
    await user.save();
    req.flash("success", "Appointment Booked");
    res.redirect(`/caredata/doctors/${req.params.id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Can't book appointment");
    res.redirect(`/caredata/doctors/${req.params.id}/book-appointment`);
  }
};
