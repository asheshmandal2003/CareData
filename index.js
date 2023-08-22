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
const Upload = require("./models/upload");
const moment = require("moment");
// const { ethers } = require("ethers");
// const { abi } = require("./public/artifacts/contracts/Upload.sol/Upload.json");

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
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/caredata", (req, res) => {
  res.render("home/index");
});

app.get("/doctors", (req, res) => {
  res.render("doctor/doctorProfile");
});

app.get("/register", (req, res) => {
  res.render("login/registerPage");
});

app.post("/register", upload.single("image"), async (req, res, next) => {
  try {
    const { fullName, username, emailId, password, entryType } = req.body;
    const user = new User({ fullName, username, emailId, entryType });
    user.image.path = req.file.path;
    user.image.filename = req.file.filename;
    try {
      const registeredUser = await User.register(user, password);
      req.logIn(registeredUser, (err) => {
        if (err) next(err);
        req.flash("success", "Welcome to CareData");
        res.redirect(`/caredata/users/${user._id}`);
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/caredata");
    }
  } catch (error) {
    next(error);
  }
});

app.get("/login", (req, res) => {
  res.render("login/loginPage");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      req.flash("success", "Welocome Back to CareData :)");
      res.redirect(`caredata`);
    } catch (error) {
      next(error);
    }
  }
);

app.get("/caredata/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id)
    .then((data) => data)
    .catch((e) => e);
  res.render("patient/profilePage", { user });
});

app.get("/caredata/users/:id/edit", async (req, res) => {
  const user = await User.findById(req.params.id)
    .then((data) => data)
    .catch((e) => e);
  res.render("patient/edit", { user });
});

app.put("/caredata/users/:id", async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/caredata/users/${req.params.id}`);
});

app.post("/logout", async (req, res) => {
  req.logOut(() => {
    try {
      req.flash("success", "You're Logged Out Now!");
      res.redirect("/caredata");
    } catch (error) {
      next(error);
    }
  });
});

app.get("/caredata/users/:id/upload", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("files");
    res.render("patient/uploadPage", { user, moment });
  } catch (error) {
    next(error);
  }
});

app.post(
  "/caredata/users/:id/upload",
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      const newUpload = new Upload({
        path: req.file.path,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        author: user._id,
        favorite: false,
      });
      console.log(req.file);
      user.files.unshift(newUpload._id);
      await newUpload.save();
      await user.save();
      res.redirect(`/caredata/users/${req.params.id}/upload`);
    } catch (error) {
      next(error);
    }
  }
);

app.get("/caredata/users/:id/upload/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const uploadFile = await Upload.findById(postId).populate("author");
    res.render("patient/showFile", { uploadFile });
  } catch (error) {
    next(error);
  }
});

app.get("/caredata/users/:id/posts/favorite", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("patient/allFavoriteFiles", { user });
});

app.patch(
  "/caredata/users/:id/posts/:postId/favorite",
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const uploadedFile = await User.findById(postId);
      const favorite = uploadedFile.favorite;
      console.log(favorite);
      uploadedFile.favorite = !favorite;
      await uploadedFile.save();
      res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

app.get("/caredata/users/:id/files", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("files");
    res.render("patient/allUploadedFiles", { user });
  } catch (error) {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
