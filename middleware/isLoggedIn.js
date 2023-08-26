module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You're Not Signed In!");
    res.redirect("/login");
  } else {
    next();
  }
};
module.exports.returnPath = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  } else {
    next();
  }
};
