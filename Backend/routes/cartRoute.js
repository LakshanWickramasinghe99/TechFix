// routes/cartRoutes.js
import express from 'express';
import { addToCart, getCart, removeFromCart,updateCartQuantity } from '../controllers/cartcontroller.js';
import authenticateUser from '../middleware/userAuth.js';

const router = express.Router();

// Prefix the routes with '/api'
router.post('/api/cart', authenticateUser, addToCart);
router.get('/api/cart', authenticateUser, getCart);
router.delete('/api/cart/:productId', authenticateUser, removeFromCart);
router.put('/api/cart/:productId', authenticateUser, updateCartQuantity)


export default router;
