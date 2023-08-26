require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const ejsMate = require("ejs-mate");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const methodOverride = require("method-override");
const multer = require("multer");
const { storage } = require("./clodinary");
const moment = require("moment");
const DoctorDetails = require("./models/doctorDetails");
const AppError = require("./error/AppError");
const {
  doctorDetailsValidation,
} = require("./validation/doctorDetailsValidation");
const cors = require("cors");
const { isLoggedIn, returnPath } = require("./middleware/isLoggedIn");
const patientRoute = require("./routes/patientRoutes");
const loginRoute = require("./routes/login");
const doctorRoute = require("./routes/doctor");

moment().format();

mongoose
  .connect("mongodb://127.0.0.1:27017/caredata", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected!"))
  .catch((e) => console.log(e));

const app = express();
const PORT = process.env.PORT || 8080;
const sessionConfig = {
  name: "session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
const upload = multer({ storage });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(cors());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/caredata", patientRoute);
app.use("/", loginRoute);
app.use("/caredata", doctorRoute);

// app.post("/logout", async (req, res) => {
//   req.logOut(() => {
//     try {
//       req.flash("success", "You're Logged Out Now!");
//       res.redirect("/caredata");
//     } catch (error) {
//       next(error);
//     }
//   });
// });

app.get("/caredata/users/:id/upload/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    res.render("patient/showFile");
  } catch (error) {
    next(error);
  }
});

app.get("/caredata/users/:id/files", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("files");
    res.render("patient/allUploadedFiles", { user });
  } catch (error) {
    next();
  }
});
app.all("*", (req, res, next) => {
  return next(new AppError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
  if (!err.message && !err.status) {
    err.message = "Something Went Wrong!";
    err.status(500);
  }
  res.render("error/error", { err });
  next();
});
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
