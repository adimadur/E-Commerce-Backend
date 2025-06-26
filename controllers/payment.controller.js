const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const paymentService = require("../services/payment.service");

// @desc    Create stripe payment intent
// @route   POST /api/v1/payment/create-payment-intent
// @access  Private
exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { clientSecret } = await paymentService.createPaymentIntent(
    req.body.orderId
  );
  res.status(200).json({ success: true, clientSecret });
});

// @desc    Stripe webhook
// @route   POST /api/v1/payment/webhook
// @access  Public
exports.stripeWebhook = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  const result = await paymentService.handleWebhook(req.body, sig);
  res.status(200).json(result);
});
