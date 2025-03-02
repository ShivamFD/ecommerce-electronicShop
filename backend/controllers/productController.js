import Product from '../models/productModel.js';
import { deleteFile } from '../utils/file.js';
// const mongoose= require('mongoose')
import mongoose from 'mongoose';

// @desc     Fetch All Products with Advanced Filtering
// @method   GET
// @endpoint /api/v1/products
// @access   Public
const getProducts = async (req, res, next) => {
  try {
    const { limit, skip, search, category, footwearType, priceRange, brands } = req.query;

    // Build the filter object
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = new RegExp(`^${category}$`, 'i');
    if (footwearType) filter.footwearType = footwearType;
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      filter.price = { $gte: minPrice || 0, $lte: maxPrice || Infinity };
    }
    if (brands) filter.brand = { $in: brands.split(',').map((b) => b.trim()) };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(Number(limit) || 10)
      .skip(Number(skip) || 0);

    if (!products.length) {
      return res.status(404).json({ message: 'No products found!' });
    }

    res.status(200).json({
      products,
      totalPages: Math.ceil(total / (limit || 10)),
      totalProducts: total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Fetch top-rated products
// @method   GET
// @endpoint /api/v1/products/top
// @access   Public
const getTopProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ rating: -1 }).limit(3);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// @desc     Fetch Single Product
// @method   GET
// @endpoint /api/v1/products/:id
// @access   Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found!' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc     Create Product
// @method   POST
// @endpoint /api/v1/products
// @access   Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, image, description, brand, category, footwearType, price, countInStock } = req.body;

    const product = new Product({
      user: req.user._id,
      name,
      image,
      description,
      brand,
      category,
      footwearType,
      price,
      countInStock,
    });

    const createdProduct = await product.save();
    res.status(201).json({ message: 'Product created', createdProduct });
  } catch (error) {
    next(error);
  }
};

// @desc     Update Product
// @method   PUT
// @endpoint /api/v1/products/:id
// @access   Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, image, description, brand, category, footwearType, price, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found!' });
    }

    product.name = name || product.name;
    product.image = image || product.image;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.footwearType = footwearType || product.footwearType;
    product.price = price || product.price;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();

    res.status(200).json({ message: 'Product updated', updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc     Delete Product
// @method   DELETE
// @endpoint /api/v1/products/:id
// @access   Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found!' });
    }

    await Product.deleteOne({ _id: product._id });
    deleteFile(product.image);

    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

//  const createProductReview = async (req, res) => {
//   try {
//       const { productId } = req.params;  // Get product ID from request params
//       const { rating, comment } = req.body; // Get review details from request body
//       const userId = req.user._id; // Get logged-in user ID from authentication middleware

//       // Find the product
//       const product = await Product.findById(productId);
//       if (!product) {
//           return res.status(404).json({ message: "Product not found" });
//       }

//       // Check if user has already reviewed the product
//       const existingReview = product.reviews.find((review) => review.user.toString() === userId.toString());

//       if (existingReview) {
//           // Update existing review
//           existingReview.rating = rating;
//           existingReview.comment = comment;
//       } else {
//           // Add a new review
//           const newReview = {
//               user: userId,
//               name: req.user.name, // Assuming user has a `name` field
//               rating: Number(rating),
//               comment,
//           };
//           product.reviews.push(newReview);
//       }

//       // Update total rating and number of reviews
//       product.numReviews = product.reviews.length;
//       product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.numReviews;

//       // Save the product with updated reviews
//       await product.save();
      
//       res.status(200).json({ message: "Review added successfully" });

//   } catch (error) {
//       console.error("Error adding review:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const createProductReview = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    console.log("📥 Received productId:", productId); // ✅ Debugging
    console.log("📥 Rating:", rating, "Comment:", comment); // ✅ Debugging

    if (!mongoose.Types.ObjectId.isValid(productId)) { // ✅ Fix error here
      console.log("❌ Invalid productId format");
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found!');
    }

    console.log("✅ Product found:", product.name); // ✅ Debugging

    const existingReview = product.reviews.find((review) => review.user.toString() === userId.toString());

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      const newReview = {
        user: userId,
        name: req.user.name,
        rating: Number(rating),
        comment,
      };
      product.reviews.push(newReview);
    }

    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.numReviews;

    await product.save();
    res.status(200).json({ message: "Review added successfully" });

  } catch (error) {
    console.error("❌ Error adding review:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
  createProductReview,
};
