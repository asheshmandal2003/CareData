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
      .populate("appointments");
    res.render("patient/profilePage", { user });
  } catch (error) {
    next(error);
  }
};

module.exports.editPage = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .then((data) => data)
      .catch((e) => e);
    res.render("patient/edit", { user });
  } catch (error) {
    next(error);
  }
};

module.exports.edit = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/caredata/users/${req.params.id}`);
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
