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
    req.user.appointments.push(newAppointment);
    await newAppointment.save();
    await user.save();
    await req.user.save();
    req.flash("success", "Appointment Booked");
    res.redirect(`/caredata/doctors/${req.params.id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Can't book appointment");
    res.redirect(`/caredata/doctors/${req.params.id}/book-appointment`);
  }
};

module.exports.showDoctorAppointments = async (req, res, next) => {
  try {
    const doctorId = req.params.id;
    // Find doctor user
    const doctor = await User.findById(doctorId).populate("doctorDetails");
    if (!doctor) {
      req.flash("error", "Doctor not found");
      return res.redirect("/caredata/doctors");
    }
    // Find appointments by doctorId
    const appointments = await Appointment.find({ doctorId }).sort({
      date: 1,
      timeslot: 1,
    });

    res.render("appointment/doctorAppointments", {
      doctor,
      appointments,
      moment,
    });
  } catch (error) {
    next(error);
  }
};
