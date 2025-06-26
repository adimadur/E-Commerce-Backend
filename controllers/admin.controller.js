const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/admin/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Create user
// @route   POST /api/v1/admin/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc    Update user
// @route   PUT /api/v1/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get dashboard stats
// @route   GET /api/v1/admin/dashboard-stats
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get counts
  const usersCount = await User.countDocuments();
  const productsCount = await Product.countDocuments();
  const ordersCount = await Order.countDocuments();

  // Get total sales
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  const totalSales = result.length > 0 ? result[0].totalSales : 0;

  // Get recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({
      path: "user",
      select: "name",
    });

  // Get top selling products
  const topProducts = await Product.find()
    .sort({ sold: -1 })
    .limit(5)
    .select("name price sold images");

  res.status(200).json({
    success: true,
    data: {
      usersCount,
      productsCount,
      ordersCount,
      totalSales,
      recentOrders,
      topProducts,
    },
  });
});

// @desc    Get sales analytics
// @route   GET /api/v1/admin/sales-analytics
// @access  Private/Admin
exports.getSalesAnalytics = asyncHandler(async (req, res, next) => {
  // Get sales by month
  const salesByMonth = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalSales: { $sum: "$totalPrice" },
        numOrders: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Get sales by category
  const salesByCategory = await Order.aggregate([
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $group: {
        _id: "$product.category",
        totalSales: { $sum: "$items.price" },
        numProducts: { $sum: "$items.quantity" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      salesByMonth,
      salesByCategory,
    },
  });
});
