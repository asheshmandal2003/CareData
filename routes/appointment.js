const express = require("express");
const appointmaent = require("../controllers/appointment");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const { authorizedRoute } = require("../middleware/authorizedRoute");

const router = express.Router();

router
  .route("/:id/book-appointment")
  .get(isLoggedIn, appointmaent.appointmentForm)
  .post(isLoggedIn, appointmaent.bookAppointment);

module.exports = router;
