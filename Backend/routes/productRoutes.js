const express = require('express');
const { addProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/add', upload.single('image'), addProduct);
router.get('/all', getProducts);
router.put('/update/:id', upload.single('image'), updateProduct);
router.delete('/delete/:id', deleteProduct); // This line was causing the error

module.exports = router;
