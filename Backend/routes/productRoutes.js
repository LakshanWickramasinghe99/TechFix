const express = require('express');
const { addTechFixProduct, getTechFixProducts } = require('../controllers/TechFixProductController');
const upload = require('../middleware/uploadMiddleware');
const techUpload = require('../middleware/techFixUpload');

const router = express.Router();

router.post('/add', upload.single('image'), addProduct);
router.get('/all', getProducts);
router.put('/update/:id', upload.single('image'), updateProduct);
router.delete('/delete/:id', deleteProduct); // This line was causing the error
router.get('/search', searchProductsByName);





//techFix routes
router.post('/techfix/add', techUpload.single('image'), addTechFixProduct);
router.get('/techfix/all', getTechFixProducts);




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
