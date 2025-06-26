const Joi = require("joi");
const ErrorResponse = require("../utils/errorResponse");

exports.validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return next(new ErrorResponse(messages, 400));
    }

    next();
  };
};
