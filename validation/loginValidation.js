const Joi = require("joi");

module.exports.registerValidation = (req, res, next) => {
  const registerSchema = Joi.object({
    fullName: Joi.string()
      .required()
      .messages({ "string.empty": "Please Enter Your Name!" }),
    username: Joi.string()
      .required()
      .messages({ "string.empty": "Please Enter An Username!" }),
    entryType: Joi.string()
      .required()
      .messages({ "string.empty": "Please Select Your Entry Type!" }),
    emailId: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .messages({
        "string.empty": "Please Enter Your Email ID!",
        "string.email": "Please Enter a Valid Email!",
      }),
    password: Joi.string()
      .required()
      .messages({ "string.empty": "Please Enter A Password!" }),
  });
  const validate = registerSchema.validate(req.body);
  if (validate.error) {
    req.flash("error", validate.error.message);
    res.redirect("/register");
  } else {
    next();
  }
};
module.exports.loginValidation = (req, res, next) => {
  const loginSchema = Joi.object({
    username: Joi.string()
      .required()
      .messages({ "string.empty": "Please Enter Your Username!" }),
    password: Joi.string()
      .required()
      .messages({ "string.empty": "Please Enter Your Password!" }),
  });
  const validate = loginSchema.validate(req.body);
  if (validate.error) {
    req.flash("error", validate.error.message);
    res.redirect("/register");
  } else {
    next();
  }
};
