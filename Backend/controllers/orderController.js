const Order = require('../models/order');

exports.placeOrder = async (req, res) => {
  try {
    const { products } = req.body;
    const newOrder = new Order({
      supplierId: req.supplier.supplierId,
      products,
    });

    await newOrder.save();
    res.json({ msg: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ supplierId: req.supplier.supplierId }).populate('products.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ msg: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
