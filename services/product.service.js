const Product = require("../models/Product");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("../config/cloudinary");

exports.getProducts = async (query) => {
  const features = new ApiFeatures(Product.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  return await features.query;
};

exports.createProduct = async (productData) => {
  return await Product.create(productData);
};

exports.updateProduct = async (productId, updateData) => {
  return await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  });
};

exports.uploadProductImages = async (productId, files) => {
  const uploadPromises = files.map((file) =>
    cloudinary.uploader.upload(file.path, {
      folder: "ecommerce/products",
      width: 1500,
      crop: "scale",
    })
  );

  const results = await Promise.all(uploadPromises);
  const images = results.map((result) => ({
    public_id: result.public_id,
    url: result.secure_url,
  }));

  return await Product.findByIdAndUpdate(
    productId,
    { $push: { images: { $each: images } } },
    { new: true }
  );
};
