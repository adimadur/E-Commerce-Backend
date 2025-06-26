const Joi = require("joi");

exports.orderSchema = Joi.object({
  shippingAddress: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  paymentMethod: Joi.string().valid("stripe", "paypal", "razorpay").required(),
  taxPrice: Joi.number().min(0),
  shippingPrice: Joi.number().min(0),
});
