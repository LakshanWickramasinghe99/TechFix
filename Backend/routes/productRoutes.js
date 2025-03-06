const express = require('express');
const productController = require('../controllers/productController'); // Import the controller

const router = express.Router();  // Create router instance

// Define the routes and use the controller's methods
router.post('/create', productController.postCreate);  // Route for creating a product
router.get('/all', productController.getAllProducts); // Get all products for the logged-in supplier
router.get('/:id', productController.getProductById); // Get a specific product by ID
router.put('/:id', productController.updateProductById); // Update product by ID
router.delete('/:id', productController.deleteProductById); // Delete product by ID

// Export the router
module.exports = router;
