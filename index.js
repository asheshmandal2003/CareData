require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const LabTest = require("./models/labTest");
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
const cors = require("cors");
const patientRoute = require("./routes/patientRoutes");
const loginRoute = require("./routes/login");
const doctorRoute = require("./routes/doctor");
const appointmentRoute = require("./routes/appointment");
// GET THIS:
const { isLoggedIn } = require("./middleware/isLoggedIn");

const { ExpressPeerServer } = require("peer");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const opinions = { debug: true };

moment().format();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/caredata";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((e) => console.log(e));

const PORT = process.env.PORT || 8080;
const sessionConfig = {
  name: "session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
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

// Middleware to expose user and flash messages and page variable to all views
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  if (typeof res.locals.page === "undefined") {
    res.locals.page = "";
  }
  next();
});

app.use("/", loginRoute);
app.use("/caredata", patientRoute);
app.use("/caredata/doctors", doctorRoute);
app.use("/caredata/users", appointmentRoute);

/* ======== ROUTE PROTECTION SECTION ======= */

// Home page (public)
app.get("/caredata", (req, res) => {
  res.locals.page = "home";
  res.render("home/index");
});

// Doctors list (public - but you can add isLoggedIn if you want to protect it)
app.get("/caredata/doctors", async (req, res, next) => {
  try {
    const doctors = await User.find({}).populate("doctorDetails");
    res.render("doctor/findDoctors", { doctors, page: "doctors" });
  } catch (e) {
    next(e);
  }
});

app.use("/labtests", require("./routes/labTestRoutes"));

app.use("/blogs", require("./routes/blogRoutes"));

// Video consultation dashboard route
app.get("/video", (req, res) => {
  res.render("videoconsult/room", { page: "video" });
});

// Video room creation and joining routes
app.get("/room", (req, res) => {
  res.render("videoconsult/room", { page: "video" });
});

app.post("/create-room", (req, res) => {
  const { username } = req.body;
  if (!username || username.trim() === "") {
    req.flash("error", "Username is required to create a room.");
    return res.redirect("/room");
  }
  const roomId = uuidv4();
  return res.redirect(
    `/${roomId}?username=${encodeURIComponent(username.trim())}`
  );
});

app.get("/:room", (req, res) => {
  const roomId = req.params.room;
  const user = req.query.username || "Anonymous";
  res.render("videoconsult/doctorvideo", { roomId, user, page: "video" });
});

// Patient meeting join routes
app.get("/patient/join-meeting", (req, res) => {
  res.render("patientJoinMeeting");
});

app.post("/patient/join-meeting", (req, res) => {
  const meetingLink = req.body.meetingLink;
  res.render("patientMeeting", { meetingLink });
});

// PeerJS server for WebRTC signaling
app.use("/peerjs", ExpressPeerServer(server, opinions));

// Root redirect
app.get("/", (req, res) => {
  res.redirect("/caredata");
});

// Socket.io connections and handlers
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    setTimeout(() => {
      socket.to(roomId).emit("user-connected", userId);
    }, 1000);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
    socket.on("end-meeting", (roomId) => {
      io.to(roomId).emit("meeting-ended");
    });
  });
});

// 404 handler
app.all("*", (req, res, next) => {
  return next(new AppError(404, "Page Not Found!"));
});

// Global error handler
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || "Something Went Wrong!";

  if (err.status === 500) {
    console.error(err.stack);
  }

  res.status(err.status).render("error/error", {
    err: {
      status: err.status,
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
      additionalInfo: err.additionalInfo || null,
    },
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
