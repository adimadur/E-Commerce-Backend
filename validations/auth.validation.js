const Joi = require("joi");

exports.registerSchema = Joi.object({
  name: Joi.string().required().max(50),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("customer", "admin").default("customer"),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
