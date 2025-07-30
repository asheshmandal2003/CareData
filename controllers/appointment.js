const User = require("../models/user");
const Appointment = require("../models/appointmaent");
const moment = require("moment");

function generateTimeSlots(openStr, closeStr) {
  const slots = [];
  let open = moment(openStr, "hh:mm A");
  const close = moment(closeStr, "hh:mm A");

  while (open.isBefore(close)) {
    slots.push(open.format("HH:mm")); // store in 24-hour format
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

    // Get clinic timings from doctor details
    const clinicTimings = doctor.doctorDetails.clinicTimings || [];

    // Generate timeslots per day upfront
    // e.g. { Monday: ["09:00", "09:30", ...], Wednesday: [...] }
    const slotsByDay = {};
    clinicTimings.forEach(({ day, open, close }) => {
      slotsByDay[day] = generateTimeSlots(open, close);
    });

    // Map appointments to simple objects with date and timeslot formatted for frontend
    const appointments = doctor.appointments.map((app) => ({
      date: moment(app.date).format("YYYY-MM-DD"),
      timeslot: app.timeslot,
    }));

    // Extract clinic days for frontend use (e.g., to enable picker days)
    const clinicDays = clinicTimings.map((ct) => ct.day);

    // Render template passing all relevant data
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
