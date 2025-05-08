import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const AdminOrderPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const res = await axios.get('http://localhost:5000/api/admin/orders');
      setOrders(res.data);
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/orders/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="flex items-center px-2 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            {status}
          </span>
        );
      case 'Processing':
        return (
          <span className="flex items-center px-2 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
            <Clock className="w-4 h-4 mr-1" />
            {status}
          </span>
        );
      case 'Pending':
        return (
          <span className="flex items-center px-2 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            {status}
          </span>
        );
      case 'Cancelled':
        return (
          <span className="flex items-center px-2 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
            <AlertCircle className="w-4 h-4 mr-1" />
            {status}
          </span>
        );
      default:
        return (
          <span className="flex items-center px-2 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
          <p className="text-gray-500 mt-1">View and manage all customer orders</p>
        </div>
        <button 
          onClick={fetchOrders}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{order._id.slice(-8)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2 justify-end">
                    <button 
                      onClick={() => handleDelete(order._id)}
                      className="p-1 rounded-full text-red-600 hover:bg-red-100 transition duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderPanel;