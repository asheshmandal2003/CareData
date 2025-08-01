const LabTest = require("../models/labTest");
const LabBooking = require("../models/labBooking");

// List all lab tests
module.exports.getAllLabTests = async (req, res, next) => {
  try {
    const labTests = await LabTest.find({}).sort({ name: 1 });
    res.render("labtests/index", { labTests });
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

// Handle booking POST
module.exports.createBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const labTest = await LabTest.findById(id);
    if (!labTest) {
      req.flash("error", "Lab test not found");
      return res.redirect("/labtests");
    }

    // Destructure and sanitize the patient booking form
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

    // You may want to validate more strictly here (left minimal)
    const booking = new LabBooking({
      labTest: labTest._id,
      patientName,
      patientEmail,
      phone,
      age,
      gender,
      address,
      appointmentDate,
      timeSlot,
      notes,
    });

    await booking.save();

    req.flash(
      "success",
      "Your booking has been submitted! We'll contact you soon."
    );
    res.redirect("/labtests/" + id);
  } catch (e) {
    next(e);
  }
};
