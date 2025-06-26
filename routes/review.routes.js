const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { apiLimiter } = require("../middlewares/rateLimit.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { reviewSchema } = require("../validations/review.validation");

// Public routes
router.get("/", apiLimiter, reviewController.getReviews);
router.get("/:id", apiLimiter, reviewController.getReview);
router.get("/products/:productId", apiLimiter, reviewController.getReviews);

// Protect all routes after this middleware
router.use(authMiddleware.protect);

router.post(
  "/products/:productId",
  apiLimiter,
  validate(reviewSchema, "body"),
  reviewController.addReview
);
router.put(
  "/:id",
  apiLimiter,
  validate(reviewSchema, "body"),
  reviewController.updateReview
);
router.delete("/:id", apiLimiter, reviewController.deleteReview);

module.exports = router;
