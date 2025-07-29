const mongoose = require("mongoose");
const User = require("../models/user");
const DoctorDetails = require("../models/doctorDetails");

// Fetch list of all doctors with populated details
module.exports.doctors = async (req, res, next) => {
  try {
    console.log("Fetching doctors list...");
    const doctors = await User.find({ entryType: "doctor" })
      .populate("doctorDetails")
      .sort({ "doctorDetails.experience": -1 }); // Be careful, .sort on populated fields may not always work!
    console.log("Doctors found:", doctors.length);
    // If you want more detail: doctors.map(d=>({id: d._id, name: d.fullName}))
    res.render("doctor/findDoctors", { doctors, page: "doctors" });
  } catch (error) {
    console.error("Error fetching doctors list:", error);
    next(error);
  }
};

// Fetch detailed doctor profile with all populated relations
module.exports.doctorProfile = async (req, res, next) => {
  try {
    console.log("Fetching doctor profile for ID:", req.params.id);
    const doctor = await User.findById(req.params.id)
      .populate("doctorDetails")
      .populate("appointments"); // assuming appointments is referenced similarly
    if (!doctor || doctor.entryType !== "doctor") {
      console.warn("Doctor not found or not a doctor:", req.params.id);
      req.flash("error", "Doctor not found");
      return res.redirect("/caredata/doctors");
    }
    console.log("Doctor profile found:", {
      id: doctor._id,
      name: doctor.fullName,
      doctorDetails: !!doctor.doctorDetails,
      appointmentsCount: Array.isArray(doctor.appointments)
        ? doctor.appointments.length
        : 0,
    });
    res.render("doctor/doctorProfile", { doctor, page: "profile" });
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    next(error);
  }
};

// Render form to add or update doctor details (only for authorized doctors)
module.exports.addDetailsPage = async (req, res, next) => {
  try {
    console.log("Fetching add/update details page for user ID:", req.params.id);
    const user = await User.findById(req.params.id).populate("doctorDetails");
    if (!user || user.entryType !== "doctor") {
      console.warn(
        "Unauthorized access or invalid doctor for addDetailsPage:",
        req.params.id
      );
      req.flash("error", "Unauthorized access or invalid doctor.");
      return res.redirect("/caredata/doctors");
    }
    console.log("Rendering add/update details page for:", user.fullName);
    res.render("doctor/addDoctorDetails", { user, page: "addDetails" });
  } catch (error) {
    console.error("Error rendering addDetailsPage:", error);
    next(error);
  }
};

// Add or update doctor details form submission handler
module.exports.addOrUpdateDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Handling addOrUpdateDetails for user ID:", id);
    const user = await User.findById(id).populate("doctorDetails");
    if (!user || user.entryType !== "doctor") {
      console.warn("Unauthorized access or invalid doctor on save:", id);
      req.flash("error", "Unauthorized access or invalid doctor.");
      return res.redirect("/caredata/doctors");
    }

    // Build doctorDetails object - extract and sanitize fields from req.body
    const {
      education,
      speciality,
      subSpecialities,
      clinicName,
      clinicAddress,
      fees,
      location,
      contactNumber,
      email,
      language,
      aboutDoctor,
      experience,
      regId,
      awards,
      certifications,
      services,
      consultationTypes,
      clinicTimings,
      socialLinks,
      profilePhotoUrl,
    } = req.body;

    // Check incoming body (for debug):
    console.log("Form submission body:", req.body);

    // Process arrays: ensure arrays if single string input is sent
    const ensureArray = (input) => {
      if (!input) return [];
      if (Array.isArray(input)) return input;
      return [input];
    };

    const updatedDetails = {
      education: education?.trim(),
      speciality: speciality?.trim(),
      subSpecialities: ensureArray(subSpecialities).map((s) =>
        (s || "").trim()
      ),
      clinicName: clinicName?.trim(),
      clinicAddress: clinicAddress?.trim(),
      fees: parseFloat(fees),
      location: location?.trim(),
      contactNumber: contactNumber?.trim(),
      email: email?.toLowerCase().trim(),
      language: ensureArray(language).map((l) => (l || "").trim()),
      aboutDoctor: aboutDoctor?.trim(),
      experience: parseInt(experience),
      regId: regId?.trim(),
      awards: ensureArray(awards).map((a) => (a || "").trim()),
      certifications: ensureArray(certifications).map((c) => (c || "").trim()),
      services: ensureArray(services).map((s) => (s || "").trim()),
      consultationTypes: ensureArray(consultationTypes),
      clinicTimings: Array.isArray(clinicTimings)
        ? clinicTimings.map((t) => ({
            day: t.day,
            open: t.open,
            close: t.close,
          }))
        : [],
      socialLinks: socialLinks || {},
      profilePhotoUrl: profilePhotoUrl?.trim(),
    };

    console.log("Prepared doctor details for save/update:", updatedDetails);

    if (user.doctorDetails) {
      // Update existing doctor's details
      console.log("Updating doctor details for:", user.fullName);
      await DoctorDetails.findByIdAndUpdate(
        user.doctorDetails._id,
        updatedDetails,
        { new: true, runValidators: true }
      );
      console.log("Doctor details updated.");
    } else {
      // Create new details and link to user
      console.log("Creating new doctor details for:", user.fullName);
      const newDetails = new DoctorDetails(updatedDetails);
      await newDetails.save();
      user.doctorDetails = newDetails._id;
      await user.save();
      console.log("Doctor details created and linked to user.");
    }

    req.flash("success", "Doctor details saved successfully.");
    res.redirect(`/caredata/doctors/${user._id}`);
  } catch (error) {
    console.error("Error in addOrUpdateDetails:", error);
    req.flash("error", "Failed to save doctor details.");
    next(error);
  }
};
