const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { apiLimiter } = require("../middlewares/rateLimit.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { productSchema } = require("../validations/product.validation");
const authMiddleware = require("../middlewares/auth.middleware");

router
  .route("/")
  .get(apiLimiter, productController.getProducts)
  .post(
    authMiddleware.protect,
    authMiddleware.authorize("admin"),
    validate(productSchema, "body"),
    productController.createProduct
  );

router
  .route("/:id")
  .get(apiLimiter, productController.getProduct)
  .put(
    authMiddleware.protect,
    authMiddleware.authorize("admin"),
    validate(productSchema, "body"),
    productController.updateProduct
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.authorize("admin"),
    productController.deleteProduct
  );

router.put(
  "/:id/photo",
  authMiddleware.protect,
  authMiddleware.authorize("admin"),
  productController.productPhotoUpload
);

module.exports = router;
