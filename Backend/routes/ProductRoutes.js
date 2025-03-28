const express = require('express');
const { getAllProducts } = require('../Controller/ProductController');
const router = express.Router();

// Route to get all products
router.get('/', getAllProducts);

module.exports = router;
