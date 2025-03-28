import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity: initialQuantity } = location.state || {};

  const [quantity, setQuantity] = useState(initialQuantity || 1); // State to manage the quantity

  // If no product data is found, redirect back
  if (!product) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold">
        No order details found. <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const handleConfirmOrder = () => {
    // Save the order data to localStorage
    const orderDetails = { product, quantity };
    localStorage.setItem('order', JSON.stringify(orderDetails));  // Saving to localStorage

    // Navigate to the OrderDetails page and pass the order data
    navigate('/order-details', {
      state: { product, quantity },
    });
  };

  const handleDeleteOrder = () => {
    // You can navigate back or show a message depending on your logic
    navigate('/');
  };

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity); // Update the quantity state
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Order Summary</h1>

      <div className="bg-white p-6 shadow-lg rounded-lg">
        <img
          src={product.image}
          alt={product.title}
          className="w-32 h-32 object-contain mb-4"
        />
        <h2 className="text-xl font-semibold">{product.title}</h2>
        <p className="text-gray-600">{product.specs}</p>
        <p className="text-gray-600">{product.ram}</p>
        <p className="text-lg font-bold text-red-600">LKR {product.price * quantity}</p>
        <p className="text-gray-700">Quantity: {quantity}</p>

        {/* Quantity update buttons */}
        <div className="flex items-center mt-4">
          <button
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l-lg hover:bg-gray-300 transition"
            onClick={() => handleUpdateQuantity(quantity - 1)}
          >
            −
          </button>
          <span className="px-4 py-1 bg-gray-100 text-gray-900 border">{quantity}</span>
          <button
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 transition"
            onClick={() => handleUpdateQuantity(quantity + 1)}
          >
            +
          </button>
        </div>

        <div className="mt-4 flex gap-4">
          {/* Confirm Order Button */}
          <button
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition"
            onClick={handleConfirmOrder}
          >
            ✅ Confirm Order
          </button>

          {/* Delete Order Button */}
          <button
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-800 transition"
            onClick={handleDeleteOrder}
          >
            🗑️ Delete Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
