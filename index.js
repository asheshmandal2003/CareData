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
const appontmentRoute = require("./routes/appointment");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const { ExpressPeerServer } = require("peer");
const opinions = {
  debug: true,
};
const { v4: uuidv4 } = require("uuid");

moment().format();

mongoose
  .connect("mongodb://127.0.0.1:27017/caredata", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected!"))
  .catch((e) => console.log(e));

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
app.use("/", loginRoute);
app.use("/caredata", patientRoute);
app.use("/caredata/doctors", doctorRoute);
app.use("/caredata/doctors", appontmentRoute);

app.get("/patient/join-meeting", (req, res) => {
  res.render("patientJoinMeeting");
});

app.post("/patient/join-meeting", (req, res) => {
  const meetingLink = req.body.meetingLink;
  res.render("patientMeeting", { meetingLink });
});
app.get("/video", isLoggedIn, (req, res) => {
  res.render("videoconsult/doctorvideo");
});

app.use("/peerjs", ExpressPeerServer(server, opinions));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("videoconsult/room", { roomId: req.params.room });
});

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

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
