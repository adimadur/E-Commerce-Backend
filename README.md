# E-Commerce Platform

A full-featured E-Commerce backend built with Node.js, Express, and MongoDB. This project provides robust APIs for user authentication, product management, cart, orders, payments, reviews, and admin analytics. It is production-ready, containerized with Docker, and follows best security and validation practices.

---

## Features

- **User Authentication & Authorization**
  - Register, login, logout, JWT-based auth
  - Role-based access (customer, admin)
- **Product Management**
  - CRUD operations for products (admin)
  - Product listing, search, filtering, and pagination
- **Cart System**
  - Add, update, remove items in user cart
  - Cart subtotal calculation
- **Order Management**
  - Place orders from cart
  - View user orders, order details
  - Admin can view all orders, update delivery status
- **Payment Integration**
  - Stripe payment intent creation
  - Webhook support for payment confirmation
- **Reviews & Ratings**
  - Users can review and rate products
  - Average rating and review count per product
- **Admin Dashboard**
  - User, product, and order management
  - Sales analytics and dashboard stats
- **Security**
  - Rate limiting, input sanitization, XSS protection, HTTP headers
- **Validation**
  - Joi-based request validation for all endpoints
- **Email Notifications**
  - Password reset, order confirmation (via Nodemailer)
- **Logging**
  - HTTP request and error logging (Winston, Morgan)
- **Dockerized**
  - Easy deployment with Docker and Docker Compose

---

## Tech Stack
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Passport** (JWT strategy)
- **Stripe** (payments)
- **Cloudinary** (image uploads)
- **Joi** (validation)
- **Nodemailer** (emails)
- **Docker**

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/e-commerce.git
cd E-Commerce-Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file or edit `config/config.env` with the following:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_pass
EMAIL_FROM=your_email_from
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 4. Run Locally
```bash
npm start
```
The server will start on `http://localhost:5000`.

---

## Running with Docker

### 1. Build and Start Containers
```bash
docker-compose up --build
```
- The API will be available at `http://localhost:5000`
- MongoDB will run in a separate container

### 2. Stopping Containers
```bash
docker-compose down
```

---

## API Endpoints (Summary)
- `/api/v1/auth` - User authentication (register, login, logout, profile, password reset)
- `/api/v1/products` - Product listing, details, CRUD (admin)
- `/api/v1/cart` - User cart management
- `/api/v1/orders` - Order placement, user/admin order management
- `/api/v1/payment` - Stripe payment integration
- `/api/v1/reviews` - Product reviews and ratings
- `/api/v1/admin` - Admin dashboard, user/product/order management

---

## Folder Structure
```
E-Commerce/
  app.js
  config/
  controllers/
  middlewares/
  models/
  routes/
  services/
  utils/
  validations/
  Dockerfile
  docker-compose.yml
  package.json
  .gitignore
  README.md
```

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---
