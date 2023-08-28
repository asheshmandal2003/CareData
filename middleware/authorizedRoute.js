const User = require("../models/user");

module.exports.authorizedRoute = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    req.flash("error", "Can't find the user :(");
    res.redirect("/caredata");
  } else if (req.user === undefined || req.user.username !== user.username) {
    req.flash("error", "You don't have access of it :(");
    res.redirect("/caredata");
  } else {
    next();
  }
};
