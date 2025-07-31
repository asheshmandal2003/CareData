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

// GET /doctors/:id or /doctors/:id/:tab
module.exports.doctorProfile = async (req, res, next) => {
  try {
    const tab = req.params.tab || req.query.tab || "profile";
    const doctor = await User.findById(req.params.id)
      .populate("doctorDetails")
      .populate("appointments");
    if (!doctor || doctor.entryType !== "doctor") {
      req.flash("error", "Doctor not found");
      return res.redirect("/caredata/doctors");
    }
    res.render("doctor/doctorProfile", {
      doctor,
      page: "profile",
      activeTab: tab,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// Helper to parse comma-separated inputs into array safely
const toArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

// Helper to parse clinicTimings input and normalize time strings (optional)
const processClinicTimings = (clinicTimings) => {
  if (!Array.isArray(clinicTimings)) return [];

  return clinicTimings.map((t) => {
    // Normalize time if you want (optional)
    const openTime = t.open || "";
    const closeTime = t.close || "";

    // Example: format HH:mm (24hr) or pass as is (adjust per your needs)
    // Here, just pass as is assuming the form inputs are in proper format
    return {
      day: t.day,
      open: openTime,
      close: closeTime,
    };
  });
};

// Render Add or Update Doctor Details Page (GET)
module.exports.addDetailsPage = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("doctorDetails");

    if (!user || user.entryType !== "doctor") {
      req.flash("error", "Unauthorized access or invalid doctor.");
      return res.redirect("/caredata/doctors");
    }

    res.render("doctor/addDoctorDetails", { user, page: "addDetails" });
  } catch (error) {
    console.error("Error rendering addDetailsPage:", error);
    next(error);
  }
};

// Add or Update Doctor Details (POST) with image upload handling
module.exports.addOrUpdateDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate("doctorDetails");

    if (!user || user.entryType !== "doctor") {
      req.flash("error", "Unauthorized access or invalid doctor.");
      return res.redirect("/caredata/doctors");
    }

    // Extract incoming form fields
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

    // Debug log
    console.log("Form submission body:", req.body);
    if (req.file) {
      console.log("Uploaded file info:", req.file);
    }

    // Parse arrays from comma separated strings or checkbox arrays
    const updatedDetails = {
      education: education?.trim(),
      speciality: speciality?.trim(),
      subSpecialities: toArray(subSpecialities),
      clinicName: clinicName?.trim(),
      clinicAddress: clinicAddress?.trim(),
      fees: fees ? parseFloat(fees) : undefined,
      location: location?.trim(),
      contactNumber: contactNumber?.trim(),
      email: email?.toLowerCase().trim(),
      language: toArray(language),
      aboutDoctor: aboutDoctor?.trim(),
      experience: experience ? parseInt(experience) : undefined,
      regId: regId?.trim(),
      awards: toArray(awards),
      certifications: toArray(certifications),
      services: toArray(services),
      consultationTypes: Array.isArray(consultationTypes)
        ? consultationTypes
        : consultationTypes
        ? [consultationTypes]
        : [],
      clinicTimings: processClinicTimings(
        Array.isArray(clinicTimings)
          ? clinicTimings
          : clinicTimings
          ? [clinicTimings]
          : []
      ),
      socialLinks: {
        website: socialLinks?.website?.trim() || "",
        linkedin: socialLinks?.linkedin?.trim() || "",
        facebook: socialLinks?.facebook?.trim() || "",
        twitter: socialLinks?.twitter?.trim() || "",
        instagram: socialLinks?.instagram?.trim() || "",
      },
      // Handle image URL prioritizing uploaded file path
      profilePhotoUrl: req.file?.path || profilePhotoUrl?.trim() || "",
      updatedAt: new Date(),
    };

    // Save or update doctor's details
    if (user.doctorDetails) {
      await DoctorDetails.findByIdAndUpdate(
        user.doctorDetails._id,
        updatedDetails,
        { new: true, runValidators: true }
      );
      console.log(`Doctor details updated for user: ${user.fullName}`);
    } else {
      const newDetails = new DoctorDetails(updatedDetails);
      await newDetails.save();
      user.doctorDetails = newDetails._id;
      await user.save();
      console.log(
        `Doctor details created and linked for user: ${user.fullName}`
      );
    }

    req.flash("success", "Doctor details saved successfully.");
    res.redirect(`/caredata/doctors/${user._id}`);
  } catch (error) {
    console.error("Error in addOrUpdateDetails:", error);
    req.flash("error", "Failed to save doctor details.");
    next(error);
  }
};
