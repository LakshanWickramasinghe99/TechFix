const express = require('express');
const { addProduct, getProducts, updateProduct, deleteProduct, searchProductsByName } = require('../controllers/productController');
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




module.exports = router;
