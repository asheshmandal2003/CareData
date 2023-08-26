const patient = require("../controllers/patient");
const express = require("express");
const { isLoggedIn } = require("../middleware/isLoggedIn");

const router = express.Router();

router.get("/", patient.homepage);

router
  .route("/users/:id")
  .get(isLoggedIn, patient.userPage)
  .put(isLoggedIn, patient.edit);

router.get("/users/:id/edit", isLoggedIn, patient.editPage);

router.get("/users/:id/upload", isLoggedIn, patient.uploadPage);

module.exports = router;
