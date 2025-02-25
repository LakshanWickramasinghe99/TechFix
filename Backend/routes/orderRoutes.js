const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { placeOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');

const router = express.Router();

router.post('/place', authenticate, placeOrder);
router.get('/all', authenticate, getOrders);
router.put('/update/:id', authenticate, updateOrderStatus);

module.exports = router;
