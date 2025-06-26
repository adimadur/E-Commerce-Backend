const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress, paymentMethod, taxPrice, shippingPrice } = req.body;

  // Get user cart
  const cart = await Cart.findOne({ user: req.user.id }).populate({
    path: "items.product",
    select: "name price quantity",
  });

  if (!cart || cart.items.length === 0) {
    return next(new ErrorResponse("No items in cart", 400));
  }

  // Check if all items are in stock
  for (const item of cart.items) {
    const product = item.product;
    if (product.quantity < item.quantity) {
      return next(
        new ErrorResponse(
          `Product ${product.name} only has ${product.quantity} items in stock`,
          400
        )
      );
    }
  }

  // Create order items array from cart
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.price,
  }));

  // Create order
  const order = new Order({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice: taxPrice || 0,
    shippingPrice: shippingPrice || 0,
  });

  // Save order
  await order.save();

  // Update product quantities
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    product.quantity -= item.quantity;
    product.sold += item.quantity;
    await product.save();
  }

  // Clear cart
  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: "user",
      select: "name email",
    })
    .populate({
      path: "items.product",
      select: "name price images",
    });

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is order owner or admin
  if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this order`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is order owner or admin
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this order`,
        401
      )
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address,
  };

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    data: updatedOrder,
  });
});

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = "delivered";

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    data: updatedOrder,
  });
});

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
