const express = require("express");
const {
  registerValidation,
  loginValidation,
} = require("../validation/loginValidation");
const login = require("../controllers/login");
const multer = require("multer");
const { storage } = require("../clodinary");
const { returnPath } = require("../middleware/isLoggedIn");
const passport = require("passport");

const upload = multer({ storage });

const router = express.Router();

router
  .route("/register")
  .get(login.registerPage)
  .post(upload.single("image"), registerValidation, login.register);

router
  .route("/login")
  .get(login.loginPage)
  .post(
    loginValidation,
    returnPath,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    login.login
  );

router.post("/logout", login.logout);

module.exports = router;
