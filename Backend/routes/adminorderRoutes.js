import express from 'express';
import { getAllOrders, deleteOrder } from '../controllers/adminorderController.js';

const router = express.Router();

// Admin routes
router.get('/', getAllOrders); // View all orders
router.delete('/:orderId', deleteOrder); // Delete specific order

export default router;
