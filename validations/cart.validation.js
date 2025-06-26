const Joi = require("joi");

exports.cartSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).required(),
});

exports.updateCartSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});
