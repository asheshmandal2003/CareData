const User = require("../models/user");
const Appointment = require("../models/appointmaent");
const moment = require("moment");

function generateTimeSlots(openStr, closeStr) {
  const slots = [];
  // Try 24h first. If invalid, fall back to 12h AM/PM.
  let open = moment(openStr, "HH:mm", true);
  let close = moment(closeStr, "HH:mm", true);

  if (!open.isValid()) open = moment(openStr, "hh:mm A", true);
  if (!close.isValid()) close = moment(closeStr, "hh:mm A", true);

  if (!open.isValid() || !close.isValid()) return slots; // Bad input

  while (open.isBefore(close)) {
    slots.push(open.format("HH:mm"));
    open.add(30, "minutes");
  }
  return slots;
}

module.exports.appointmentForm = async (req, res, next) => {
  try {
    const doctor = await User.findById(req.params.id)
      .populate("doctorDetails")
      .populate("appointments");

    if (!doctor || !doctor.doctorDetails) {
      req.flash("error", "Doctor not found or doctor details missing");
      return res.redirect("/caredata/doctors");
    }

    const allClinicTimings = doctor.doctorDetails.clinicTimings || [];
    // Filter to only days with both open and close
    const validClinicTimings = allClinicTimings.filter(
      (ct) => ct.open && ct.close && ct.open.trim() && ct.close.trim()
    );

    // Build slots only for those days
    const slotsByDay = {};
    validClinicTimings.forEach(({ day, open, close }) => {
      slotsByDay[day] = generateTimeSlots(open, close);
    });

    // Extract only valid days for frontend use
    const clinicDays = validClinicTimings.map((ct) => ct.day);

    // Map appointments to simple objects with date and timeslot formatted for frontend
    const appointments = (doctor.appointments || []).map((app) => ({
      date: moment(app.date).format("YYYY-MM-DD"),
      timeslot: app.timeslot,
    }));

    res.render("appointment/index", {
      doctor,
      moment,
      clinicDays,
      slotsByDay,
      appointments,
    });
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
    res.redirect(`/caredata/users/${req.params.id}/book-appointment`);
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
