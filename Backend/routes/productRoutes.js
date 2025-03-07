const express = require('express');
const { addTechFixProduct, getTechFixProducts,getSupProducts } = require('../controllers/TechFixProductController');
const techUpload = require('../middleware/techFixUpload');
const productController = require('../controllers/productController'); // Import the controller

const router = express.Router();

router.post('/create', productController.postCreate);  // Route for creating a product
router.get('/all', productController.getAllProducts); // Get all products for the logged-in supplier
router.get('/techFix/search', productController.getSupProducts);
// Get all products for a specific supplier
router.get('/', productController.getAllProducts);

// Get a single product by ID
router.get('/:id', productController.getProductById);

// Update product by ID
router.put('/:id', productController.updateProductById);

// Delete product by ID
router.delete('/:id', productController.deleteProductById);

router.get('/techfix/all', getTechFixProducts);
router.post('/techfix/add', techUpload.single('image'), addTechFixProduct);

module.exports = router;
