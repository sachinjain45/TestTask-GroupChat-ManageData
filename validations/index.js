const Joi = require("joi");

const signinValidation = (req, res, next) => {
  const user = (user) => {
    const JoiSchema = Joi.object({
      email: Joi.string().trim().email().max(50).required(),
      password: Joi.string().trim().min(5).max(30).required(),
    });
    return JoiSchema.validate(user);
  };
  const response = user(req.body);
  const error = response.error;
  if (error) {
    return res.status(422).json({
      error: error.details[0].message,
    });
  } else {
    next();
  }
};

const signupValidation = (req, res, next) => {
  const user = (user) => {
    const JoiSchema = Joi.object({
      firstName: Joi.string().trim().required(),
      lastName: Joi.string().trim().required(),
      email: Joi.string().trim().email().max(50).required(),
      password: Joi.string().trim().min(5).max(30).required(),
    });
    return JoiSchema.validate(user);
  };
  const response = user(req.body);
  const error = response.error;
  if (error) {
    return res.status(422).json({
      error: error.details[0].message,
    });
  } else {
    next();
  }
};

const editUserDetailValidation = (req, res, next) => {
  const user = (user) => {
    const JoiSchema = Joi.object({
      id: Joi.string().trim().required(),
      firstName: Joi.string().trim().optional(),
      lastName: Joi.string().trim().optional(),
      email: Joi.string().trim().email().max(50).optional(),
      password: Joi.string().trim().min(5).max(30).optional(),
    });
    return JoiSchema.validate(user);
  };
  const response = user(req.body);
  const error = response.error;
  if (error) {
    return res.status(422).json({
      error: error.details[0].message,
    });
  } else {
    next();
  }
};
module.exports = {
  signupValidation,
  signinValidation,
  editUserDetailValidation,
};
