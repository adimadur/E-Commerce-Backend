const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc    Get user cart
// @route   GET /api/v1/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate({
    path: "items.product",
    select: "name price images",
  });

  if (!cart) {
    return next(new ErrorResponse(`No cart found for this user`, 404));
  }

  res.status(200).json({
    success: true,
    data: cart,
  });
});

// @desc    Add item to cart
// @route   POST /api/v1/cart
// @access  Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  // Get product
  const product = await Product.findById(productId);
  if (!product) {
    return next(
      new ErrorResponse(`No product found with id ${productId}`, 404)
    );
  }

  // Check if product is in stock
  if (product.quantity < quantity) {
    return next(
      new ErrorResponse(
        `Only ${product.quantity} items available in stock`,
        400
      )
    );
  }

  // Check if user already has a cart
  let cart = await Cart.findOne({ user: req.user.id });

  if (cart) {
    // Cart exists for user
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Product exists in the cart, update the quantity
      let item = cart.items[itemIndex];
      item.quantity += quantity;
      item.total = item.quantity * item.price;
      cart.items[itemIndex] = item;
    } else {
      // Product does not exists in cart, add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        total: product.price * quantity,
      });
    }
  } else {
    // No cart for user, create new cart
    cart = new Cart({
      user: req.user.id,
      items: [
        {
          product: productId,
          quantity,
          price: product.price,
          total: product.price * quantity,
        },
      ],
    });
  }

  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  if (quantity < 1) {
    return next(new ErrorResponse(`Quantity must be at least 1`, 400));
  }

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ErrorResponse(`No cart found for this user`, 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    return next(new ErrorResponse(`No item found with id ${itemId}`, 404));
  }

  // Get product to check stock
  const product = await Product.findById(cart.items[itemIndex].product);
  if (!product) {
    return next(
      new ErrorResponse(
        `No product found with id ${cart.items[itemIndex].product}`,
        404
      )
    );
  }

  if (product.quantity < quantity) {
    return next(
      new ErrorResponse(
        `Only ${product.quantity} items available in stock`,
        400
      )
    );
  }

  // Update item quantity and total
  cart.items[itemIndex].quantity = quantity;
  cart.items[itemIndex].total = quantity * cart.items[itemIndex].price;

  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:itemId
// @access  Private
exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ErrorResponse(`No cart found for this user`, 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    return next(new ErrorResponse(`No item found with id ${itemId}`, 404));
  }

  cart.items.splice(itemIndex, 1);

  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
  });
});

// @desc    Clear cart
// @route   DELETE /api/v1/cart
// @access  Private
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: {},
  });
});
