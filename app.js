const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middlewares/error.middleware");
const passport = require("passport");
const connectDB = require("./config/db");
const ErrorResponse = require("./utils/errorResponse");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route files
const auth = require("./routes/auth.routes");
const products = require("./routes/product.routes");
const cart = require("./routes/cart.routes");
const orders = require("./routes/order.routes");
const payment = require("./routes/payment.routes");
const reviews = require("./routes/review.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Passport middleware
app.use(passport.initialize());
require("./config/passport")(passport);

// Base route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-Commerce API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      products: "/api/v1/products",
      cart: "/api/v1/cart",
      orders: "/api/v1/orders",
      payment: "/api/v1/payment",
      reviews: "/api/v1/reviews",
      admin: "/api/v1/admin"
    }
  });
});

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/products", products);
app.use("/api/v1/cart", cart);
app.use("/api/v1/orders", orders);
app.use("/api/v1/payment", payment);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/admin", adminRoutes);

// Handle 404 - catch all handler for routes that don't exist
app.use("*", (req, res, next) => {
  next(new ErrorResponse(`Route ${req.originalUrl} not found`, 404));
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
