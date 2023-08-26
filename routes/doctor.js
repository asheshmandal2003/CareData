const express = require("express");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const { authorizedRoute } = require("../middleware/authorizedRoute");
const {
  doctorDetailsValidation,
} = require("../validation/doctorDetailsValidation");
const doctor = require("../controllers/doctor");

const router = express.Router();

router.route("/").get(doctor.doctors);

router.get("/:id", doctor.doctorProfile);

router
  .route("/:id/adddetails")
  .get(isLoggedIn, authorizedRoute, doctor.addDetailsPage)
  .post(
    isLoggedIn,
    authorizedRoute,
    doctorDetailsValidation,
    doctor.addDetails
  );

module.exports = router;
