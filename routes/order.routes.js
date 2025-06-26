const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { apiLimiter } = require("../middlewares/rateLimit.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { orderSchema } = require("../validations/order.validation");

// Protect all routes
router.use(authMiddleware.protect);

router.post(
  "/",
  apiLimiter,
  validate(orderSchema, "body"),
  orderController.createOrder
);
router.get("/myorders", apiLimiter, orderController.getMyOrders);
router.get("/:id", apiLimiter, orderController.getOrder);
router.put("/:id/pay", apiLimiter, orderController.updateOrderToPaid);

// Admin only routes
router.use(authMiddleware.authorize("admin"));
router.get("/", apiLimiter, orderController.getOrders);
router.put("/:id/deliver", apiLimiter, orderController.updateOrderToDelivered);

module.exports = router;
