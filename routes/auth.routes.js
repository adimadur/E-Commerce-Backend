const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validate } = require("../middlewares/validation.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");
const {
  apiLimiter,
  authLimiter,
} = require("../middlewares/rateLimit.middleware");

router.post(
  "/register",
  apiLimiter,
  validate(registerSchema, "body"),
  authController.register
);
router.post(
  "/login",
  authLimiter,
  validate(loginSchema, "body"),
  authController.login
);
router.get("/logout", authController.logout);
router.get("/me", authMiddleware.protect, authController.getMe);
router.put(
  "/updatedetails",
  authMiddleware.protect,
  authController.updateDetails
);
router.put(
  "/updatepassword",
  authMiddleware.protect,
  authController.updatePassword
);
router.post("/forgotpassword", authController.forgotPassword);
router.put("/resetpassword/:resettoken", authController.resetPassword);

module.exports = router;
