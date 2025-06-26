const Joi = require("joi");

exports.paymentSchema = Joi.object({
  orderId: Joi.string().hex().length(24).required(),
});
