const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { apiLimiter } = require("../middlewares/rateLimit.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { paymentSchema } = require("../validations/payment.validation");

// Protect all routes
router.use(authMiddleware.protect);

router.post(
  "/create-payment-intent",
  apiLimiter,
  validate(paymentSchema, "body"),
  paymentController.createPaymentIntent
);

// Webhook needs to be public for Stripe to access
router.post("/webhook", paymentController.stripeWebhook);

module.exports = router;
