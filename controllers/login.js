const User = require("../models/user");

module.exports.registerPage = (req, res) => {
  res.render("login/registerPage");
};

module.exports.register = async (req, res, next) => {
  try {
    const { fullName, username, emailId, password, entryType } = req.body;
    const user = new User({ fullName, username, emailId, entryType });
    if (req.file) {
      user.image.path = req.file.path;
      user.image.filename = req.file.filename;
    } else {
      user.image.path = "";
      user.image.filename = "";
    }
    try {
      const registeredUser = await User.register(user, password);
      req.logIn(registeredUser, (err) => {
        if (err) next(err);
        req.flash("success", "Welcome to CareData");
        res.redirect(`caredata`);
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  } catch (error) {
    next(error);
  }
};

module.exports.loginPage = (req, res) => {
  res.render("login/loginPage");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welocome Back to CareData :)");
  res.redirect(res.locals.returnTo || "/caredata");
};

module.exports.logout = async (req, res, next) => {
  req.logOut(() => {
    try {
      req.flash("success", "You're Logged Out Now!");
      res.redirect("/caredata");
    } catch (error) {
      next(error);
    }
  });
};
