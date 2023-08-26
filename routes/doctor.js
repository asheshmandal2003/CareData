const express = require("express");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const {
  doctorDetailsValidation,
} = require("../validation/doctorDetailsValidation");
const doctor = require("../controllers/doctor");

const router = express.Router();

router.get("/doctors", doctor.doctors);

router
  .route("/users/:id/adddetails")
  .get(isLoggedIn, doctor.addDetailsPage)
  .post(isLoggedIn, doctorDetailsValidation, doctor.addDetails);

module.exports = router;
