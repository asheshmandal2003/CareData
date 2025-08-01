const express = require("express");
const router = express.Router();
const labTestController = require("../controllers/labTest");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const { isAdminMiddleware } = require("../middleware/isAdminMiddleware");

// All lab tests list (protected - user must be logged in)
router.get("/", isLoggedIn, labTestController.getAllLabTests);

// New lab test form (admin only)
// router.get("/new", isAdminMiddleware, labTestController.renderNewLabTestForm);

// Create lab test (admin only)
// router.post("/", isAdminMiddleware, labTestController.createLabTest);

// Lab Test Details (protected - user must be logged in)
router.get("/:id", isLoggedIn, labTestController.getLabTestById);

router.get("/book-labtest/:id", labTestController.renderBookingForm);
router.post("/book-labtest/:id", labTestController.createBooking);

module.exports = router;
