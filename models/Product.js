const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [0, "Price must be at least 0"],
    },
    cost: {
      type: Number,
      required: [true, "Please add a cost"],
      min: [0, "Cost must be at least 0"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: [
        "Electronics",
        "Clothing",
        "Home",
        "Books",
        "Toys",
        "Beauty",
        "Sports",
        "Other",
      ],
    },
    subCategory: {
      type: String,
    },
    quantity: {
      type: Number,
      required: [true, "Please add a quantity"],
      min: [0, "Quantity must be at least 0"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      required: [true, "Please add at least one image"],
    },
    ratings: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must can not be more than 5"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    brand: {
      type: String,
      required: [true, "Please add a brand"],
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create product slug from the name
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Cascade delete reviews when a product is deleted
productSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
  next();
});

// Reverse populate with virtuals
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

module.exports = mongoose.model("Product", productSchema);
