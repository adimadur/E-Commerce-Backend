const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");

exports.createPaymentIntent = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // in cents
    currency: "usd",
    metadata: {
      integration_check: "accept_a_payment",
      orderId: order._id.toString(),
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    amount: paymentIntent.amount,
  };
};

exports.handleWebhook = async (payload, sig) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: Date.now(),
      email_address: paymentIntent.receipt_email,
    };

    await order.save();
  }

  return { received: true };
};
