const patient = require("../controllers/patient");
const express = require("express");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const { authorizedRoute } = require("../middleware/authorizedRoute");

const router = express.Router();

router.get("/", patient.homepage);

router
  .route("/users/:id")
  .get(authorizedRoute, patient.userPage)
  .put(isLoggedIn, authorizedRoute, patient.edit);

router.get("/users/:id/edit", isLoggedIn, authorizedRoute, patient.editPage);

router.get(
  "/users/:id/upload",
  isLoggedIn,
  authorizedRoute,
  patient.uploadPage
);

module.exports = router;
