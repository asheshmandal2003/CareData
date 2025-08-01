const LabTest = require("../models/labTest");
const LabBooking = require("../models/labBooking");
const User = require("../models/user");

// List all lab tests
module.exports.getAllLabTests = async (req, res, next) => {
  try {
    const labTests = await LabTest.find({}).sort({ name: 1 });
    res.render("labtests/labtests", { labTests, page: "labtests" });
  } catch (e) {
    next(e);
  }
};

// Show single lab test details
module.exports.getLabTestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const labTest = await LabTest.findById(id);
    if (!labTest) {
      req.flash("error", "Lab test not found");
      return res.redirect("/labtests");
    }
    res.render("labtests/show", { labTest });
  } catch (e) {
    next(e);
  }
};

// Render form to create new lab test (optional - admin only)
module.exports.renderNewLabTestForm = (req, res) => {
  res.render("labtests/new");
};

// Create new lab test (optional - admin only)
module.exports.createLabTest = async (req, res, next) => {
  try {
    // Extract fields explicitly to avoid unexpected data
    const {
      name,
      description,
      category,
      price,
      preparation,
      duration,
      sampleType,
      fastingRequired,
      availability,
      labName,
      logoUrl,
      typicalResultsTime,
    } = req.body;

    // Build availability object safely if provided
    let availabilityObj = {};
    if (availability && typeof availability === "object") {
      availabilityObj.weekdays = Array.isArray(availability.weekdays)
        ? availability.weekdays
        : [];
      availabilityObj.timing = availability.timing || "";
    }

    const labTest = new LabTest({
      name,
      description,
      category,
      price,
      preparation,
      duration,
      sampleType,
      fastingRequired: fastingRequired === "true" || fastingRequired === true,
      availability: availabilityObj,
      labName,
      logoUrl,
      typicalResultsTime,
    });
    await labTest.save();
    req.flash("success", "Lab test created successfully");
    res.redirect("/labtests");
  } catch (e) {
    next(e);
  }
};

module.exports.renderBookingForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const labTest = await LabTest.findById(id);
    if (!labTest) {
      req.flash("error", "Lab test not found");
      return res.redirect("/labtests");
    }
    res.render("labtests/book", { labTest });
  } catch (e) {
    next(e);
  }
};

module.exports.createBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch lab test
    const labTest = await LabTest.findById(id);
    if (!labTest) {
      req.flash("error", "Lab test not found");
      return res.redirect("/labtests");
    }

    // Get the currently logged-in user
    const user = req.user;
    if (!user) {
      req.flash("error", "You must be logged in to book a lab test.");
      return res.redirect("/login");
    }

    // Validate and build booking object
    const {
      patientName,
      patientEmail,
      phone,
      age,
      gender,
      address,
      appointmentDate,
      timeSlot,
      notes,
    } = req.body;

    // Ensure all required fields are present and types are correct
    if (
      !patientName ||
      !patientEmail ||
      !phone ||
      !age ||
      !gender ||
      !appointmentDate
    ) {
      req.flash("error", "Please fill all required fields!");
      return res.redirect("/labtests/" + id + "/book");
    }

    // Build new booking
    const booking = new LabBooking({
      labTest: labTest._id,
      user: user._id,
      patientName,
      patientEmail,
      phone,
      age: Number(age),
      gender,
      address,
      appointmentDate, // Mongoose should auto-cast if ISO string, else new Date(appointmentDate)
      timeSlot,
      notes,
    });

    await booking.save();

    user.labBookings = user.labBookings || [];
    user.labBookings.push(booking._id);
    await user.save();

    req.flash("Your booking has been submitted! We'll contact you soon.");
    res.redirect("/labtests/" + id);
  } catch (e) {
    console.error("LAB_BOOKING_ERROR: ", e);
    req.flash(
      "error",
      "Booking creation failed: " + (e.message || "Unknown error")
    );
    res.redirect("/labtests/" + (req.params.id || ""));
  }
};

module.exports.getUserLabBookings = async (req, res, next) => {
  try {
    // Ensure user is logged in
    if (!req.user) {
      req.flash("error", "You must be logged in to view your lab bookings.");
      return res.redirect("/login");
    }

    // Fetch all lab bookings for this user, with populated lab test info
    const bookings = await LabBooking.find({ user: req.user._id })
      .populate("labTest")
      .sort({ appointmentDate: -1, createdAt: -1 });

    // Render your view (adjust 'labtests/myBookings' as needed)
    res.render("labtests/myBookings", { bookings });
  } catch (error) {
    next(error);
  }
};
