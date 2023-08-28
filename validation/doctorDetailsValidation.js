const Joi = require("joi");

module.exports.doctorDetailsValidation = (req, res, next) => {
  const doctorDetailsSchema = Joi.object({
    education: Joi.string().allow(""),
    speciality: Joi.string().allow(""),
    location: Joi.string().allow(""),
    language: Joi.string().allow(""),
    aboutDoctor: Joi.string().allow(""),
    experience: Joi.string().allow(""),
    clinicName: Joi.string().allow(""),
    fees: Joi.string().allow(""),
    open: Joi.string().allow(""),
    close: Joi.string().allow(""),
  });
  const validate = doctorDetailsSchema.validate(req.body);
  if (validate.error) {
    req.flash("error", validate.error.message);
    res.redirect(`/caredata/users/${req.params.id}/adddetails`);
  } else {
    next();
  }
};
