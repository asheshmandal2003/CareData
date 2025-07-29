const express = require("express");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const { authorizedRoute } = require("../middleware/authorizedRoute");
const {
  doctorDetailsValidation,
} = require("../validation/doctorDetailsValidation");
const doctor = require("../controllers/doctor");

const router = express.Router();

// Route: GET /doctors - list all doctors
router.get("/", doctor.doctors);

// Route: GET /doctors/:id - show doctor profile (require login)
router.get("/:id", isLoggedIn, doctor.doctorProfile);

// Routes for adding/updating doctor details (only authorized doctors):
router
  .route("/:id/adddetails")
  .get(isLoggedIn, authorizedRoute, doctor.addDetailsPage)
  .post(
    isLoggedIn,
    authorizedRoute,
    doctorDetailsValidation,
    doctor.addOrUpdateDetails // updated function name here
  );

module.exports = router;
