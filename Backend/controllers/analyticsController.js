import User from '../models/userModel.js';
import Item from '../models/Item.js';
import Order from '../models/Order.js';

export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Item.countDocuments();

    const items = await Item.find();
    const lowStockItems = items.filter(item => item.stock <= 10);

    const newUsers = await User.find({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    const productStockDetails = items.map(item => {
      let stockStatus = 'Good';
      if (item.stock <= 10) stockStatus = 'Critical';
      else if (item.stock <= 30) stockStatus = 'Low';
      return {
        title: item.title,
        price: item.price,
        stock: item.stock,
        status: stockStatus,
      };
    });

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      lowStockCount: lowStockItems.length,
      newUserCount: newUsers.length,
      stockDetails: productStockDetails
    });
  } catch (error) {
    res.status(500).json({ message: 'Analytics fetch failed', error });
  }
};
