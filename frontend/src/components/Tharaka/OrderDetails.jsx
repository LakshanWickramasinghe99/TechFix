import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity } = location.state || {};

  // If no product data is found, redirect back
  if (!product) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold">
        No order details found. <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const handleConfirmOrder = () => {
    // Navigate to the OrderDetails page and pass the order data
    navigate('/order-details', {
      state: { product, quantity },
    });
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

        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition"
          onClick={handleConfirmOrder}
        >
          ✅ Confirm Order
        </button>
      </div>
    </div>
  );
};

export default Order;
