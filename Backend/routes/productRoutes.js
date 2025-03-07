const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Create product (only for logged-in suppliers)
router.post('/create', productController.postCreate);

// Get all products for a specific supplier
router.get('/', productController.getAllProducts);

// Get a single product by ID
router.get('/:id', productController.getProductById);

// Update product by ID
router.put('/:id', productController.updateProductById);

// Delete product by ID
router.delete('/:id', productController.deleteProductById);

module.exports = router;
