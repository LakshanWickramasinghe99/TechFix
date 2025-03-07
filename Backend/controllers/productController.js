const express = require('express');
const Product = require('../models/product');
const multer = require('multer');

// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save images in 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});
const upload = multer({ storage: storage });

// Function to generate a unique productId
const generateProductId = () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(100 + Math.random() * 900); // Generates a 3-digit random number
  return `PROD-${timestamp}-${randomNum}`; // Correct template literal usage
};

// Create a product
const postCreate = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ msg: "Image upload failed", error: err });
    }

    console.log(req.body); // Check what is received in the request
    const { name, description, price, stock, category, supplierId } = req.body;

    // Validate required fields
    if (!supplierId) {
      return res.status(400).json({ msg: "Supplier ID is required" });
    }

    // Generate a unique productId
    const productId = generateProductId();

    // Create new product object with image if uploaded
    const newProduct = new Product({
      productId, // Assign the generated productId
      name,
      description,
      price,
      stock,
      category,
      supplierId,
      image: req.file ? req.file.filename : null, // Save only filename
    });

    newProduct.save()
    .then(product => res.json({ msg: "Product created successfully", product }))
    .catch(error => {
      console.error("Error saving product:", error);
      res.status(500).json({ msg: "Error creating product", error });
    });
  });
};

// Get all products for a supplier
const getAllProducts = async (req, res) => {
  try {
    const { supplierId } = req.query; // Get supplierId from query params

    if (!supplierId) {
      return res.status(400).json({ msg: "Supplier ID is required" });
    }

    const products = await Product.find({ supplierId }); // Fetch products by supplierId
    res.json(products); // Return only products belonging to the supplier
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params; // Get the productId from URL parameters

    // Fetch the product based on custom productId (not _id)
    const product = await Product.findOne({ productId: id });

    if (!product) {
      return res.status(404).json({ msg: 'Product not found for the given Product ID' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ msg: 'Internal Server Error', error: error.message });
  }
};


const updateProductById = async (req, res) => {
  try {
    const { id } = req.params; // Get the productId from URL parameters

    // Find the product by custom productId (not _id)
    const product = await Product.findOne({ productId: id });

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Update product fields
    const { name, description, price, stock, category } = req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;

    if (req.file) {
      product.image = req.file.filename; // Update image if new one is uploaded
    }

    await product.save();
    res.json({ msg: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params; // Get the productId from URL parameters

    // Find and delete the product by custom productId (not _id)
    const product = await Product.findOne({ productId: id });

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    await Product.findOneAndDelete({ productId: id });
    res.json({ msg: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// Get all supplier products (to view all products)
const getSupProducts = async (req, res) => {
  try {
    const product = await Product.find();
    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  postCreate,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getSupProducts
};
