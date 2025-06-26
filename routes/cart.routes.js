const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { apiLimiter } = require("../middlewares/rateLimit.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { cartSchema, updateCartSchema } = require("../validations/cart.validation");

// Protect all routes
router.use(authMiddleware.protect);

router.get("/", apiLimiter, cartController.getCart);
router.post(
  "/",
  apiLimiter,
  validate(cartSchema, "body"),
  cartController.addToCart
);
router.put(
  "/:itemId",
  apiLimiter,
  validate(updateCartSchema, "body"),
  cartController.updateCartItem
);
router.delete("/:itemId", apiLimiter, cartController.removeCartItem);
router.delete("/", apiLimiter, cartController.clearCart);

module.exports = router;
