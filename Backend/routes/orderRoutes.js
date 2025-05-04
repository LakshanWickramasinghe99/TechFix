import express from 'express';
import {
  placeOrder,
  getCustomerOrders,
  getSingleOrder
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', placeOrder); // Place a new order
router.get('/customer/:customerId', getCustomerOrders); // Get orders for a specific customer
router.get('/:orderId', getSingleOrder); // Get details of a specific order

export default router;
