const express = require('express');
const { addTechFixProduct, getTechFixProducts,getSupProducts } = require('../controllers/TechFixProductController');
const techUpload = require('../middleware/techFixUpload');
const productController = require('../controllers/productController'); // Import the controller
const router = express.Router();

// Define the routes and use the controller's methods
router.post('/create', productController.postCreate);  // Route for creating a product
router.get('/all', productController.getAllProducts); // Get all products for the logged-in supplier
router.get('/:id', productController.getProductById); // Get a specific product by ID
router.put('/:id', productController.updateProductById); // Update product by ID
router.delete('/:id', productController.deleteProductById); // Delete product by ID
router.get('/techFix/all', productController.getSupProducts);


//techFix routes
router.post('/techfix/add', techUpload.single('image'), addTechFixProduct);
router.get('/techfix/all', getTechFixProducts);

// Export the router
module.exports = router;
