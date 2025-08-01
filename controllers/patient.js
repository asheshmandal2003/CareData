const User = require("../models/user");
const moment = require("moment");

moment().format();

module.exports.homepage = (req, res) => {
  res.render("home/index");
};

module.exports.userPage = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("doctorDetails")
      .populate("appointments")
      .populate({
        path: "labBookings",
        populate: { path: "labTest" },
      });

    res.render("patient/profilePage", { user });
  } catch (error) {
    next(error);
  }
};

module.exports.editPage = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("patient/edit", { user });
  } catch (error) {
    next(error);
  }
};

module.exports.edit = async (req, res, next) => {
  try {
    const { fullName, username, entryType, password } = req.body;

    // Prepare update data object
    const updateData = { fullName, username, entryType };

    // Handle image upload if a file is present
    if (req.file) {
      updateData.image = {
        path: req.file.path || `/uploads/${req.file.filename}`, // adjust if you use cloudinary etc
        filename: req.file.filename,
      };
    }

    // Update basic fields except password
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    // Update password if provided
    if (password && password.trim().length > 0) {
      await user.setPassword(password);
      await user.save();
    }

    // Redirect to doctor's page if doctor, else patient page
    if (user.entryType === "doctor") {
      return res.redirect(`/caredata/doctors/${req.params.id}`);
    } else {
      return res.redirect(`/caredata/users/${req.params.id}`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports.uploadPage = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("patient/uploadPage", { moment, user });
  } catch (error) {
    next(error);
  }
};

module.exports.checkUsernameAvailability = async (req, res, next) => {
  try {
    const { username } = req.query;

    if (!username || typeof username !== "string") {
      return res
        .status(400)
        .json({ available: false, message: "Invalid username" });
    }

    const usernameLower = username.toLowerCase();

    const userExists = await User.findOne({
      username: { $regex: new RegExp(`^${usernameLower}$`, "i") },
      _id: { $ne: req.query.currentUserId },
    });

    if (userExists) {
      return res.json({ available: false });
    } else {
      return res.json({ available: true });
    }
  } catch (error) {
    next(error);
  }
};
