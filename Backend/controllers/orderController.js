import Order from '../models/Order.js';

// Place a new order
const placeOrder = async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      customerEmail,
      address,
      items,
      totalAmount
    } = req.body;

    const newOrder = new Order({
      customerId,
      customerName,
      customerEmail,
      address,
      items,
      totalAmount
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
};

// Get all orders for a specific customer
const getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get a single order
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
};

export { placeOrder, getCustomerOrders, getSingleOrder };
