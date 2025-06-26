const Joi = require("joi");

exports.productSchema = Joi.object({
  name: Joi.string().required().max(100),
  description: Joi.string().required().max(1000),
  price: Joi.number().required().min(0),
  cost: Joi.number().required().min(0),
  category: Joi.string()
    .required()
    .valid(
      "Electronics",
      "Clothing",
      "Home",
      "Books",
      "Toys",
      "Beauty",
      "Sports",
      "Other"
    ),
  quantity: Joi.number().required().min(0),
  brand: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
});
