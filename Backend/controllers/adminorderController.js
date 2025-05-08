import Order from '../models/Order.js';

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Delete order by ID (admin only)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
};
