const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { apiLimiter } = require("../middlewares/rateLimit.middleware");

// Protect all routes with admin role
router.use(authMiddleware.protect, authMiddleware.authorize("admin"));

router.get("/users", apiLimiter, adminController.getUsers);
router.get("/users/:id", apiLimiter, adminController.getUser);
router.post("/users", apiLimiter, adminController.createUser);
router.put("/users/:id", apiLimiter, adminController.updateUser);
router.delete("/users/:id", apiLimiter, adminController.deleteUser);

router.get("/dashboard-stats", apiLimiter, adminController.getDashboardStats);
router.get("/sales-analytics", apiLimiter, adminController.getSalesAnalytics);

module.exports = router;
