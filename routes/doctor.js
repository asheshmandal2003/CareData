const express = require("express");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const { authorizedRoute } = require("../middleware/authorizedRoute");
const {
  doctorDetailsValidation,
} = require("../validation/doctorDetailsValidation");
const doctor = require("../controllers/doctor");
const multer = require("multer");
const { storage } = require("../clodinary");
const upload = multer({ storage });

const router = express.Router();

// Route: GET /doctors - list all doctors
router.get("/", doctor.doctors);

// Route: GET /doctors/:id - show doctor profile (require login)
router.get("/:id", isLoggedIn, doctor.doctorProfile);

// Routes for adding/updating doctor details (only authorized doctors):
router
  .route("/:id/add")
  .get(isLoggedIn, authorizedRoute, doctor.addDetailsPage);

router
  .route("/:id/adddetails")
  .post(
    isLoggedIn,
    authorizedRoute,
    doctorDetailsValidation,
    upload.single("profilePhoto"),
    doctor.addOrUpdateDetails
  );

// Route: GET /doctors/:id/:tab - show doctor profile with specific tab
router.get("/:id/:tab", isLoggedIn, doctor.doctorProfile);

module.exports = router;
