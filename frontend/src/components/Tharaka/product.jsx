import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;

  // If no product is found
  if (!product) {
    return <div className="text-center text-red-500 text-lg font-semibold">No product found.</div>;
  }

  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // Update total price
  const totalPrice = product.price * quantity;

  const handleAddToCart = () => {
    // Retrieve current cart from localStorage (if any)
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add the product to the cart with the selected quantity
    const updatedCart = [...cart, { product, quantity }];

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Optionally, you can navigate to the cart page immediately after adding the product
    navigate('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <button
        className="mb-6 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition duration-300"
        onClick={() => navigate(-1)}
      >
        ⬅ Back
      </button>

      {/* Product Details Container */}
      <div className="bg-white border rounded-lg shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
        {/* Product Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-72 h-72 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl font-semibold text-gray-900">{product.title}</h1>
          <p className="text-lg text-gray-700">{product.specs}</p>
          <p className="text-lg text-gray-700">{product.ram}</p>

          {/* Price */}
          <p className="text-red-600 font-bold text-4xl mt-4">
            LKR {totalPrice.toLocaleString()}
          </p>

          {/* Quantity Selection */}
          <div className="mt-6 flex items-center">
            <p className="text-gray-700 font-semibold mr-4">Quantity:</p>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-l-lg hover:bg-gray-300 transition"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              −
            </button>
            <span className="px-6 py-2 bg-gray-100 text-gray-900 border">{quantity}</span>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 transition"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>

          {/* Buttons for Add to Cart & Buy Now */}
          <div className="mt-8 flex gap-6">
            <button
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-800 transition"
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>
            <button
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-800 transition"
              onClick={() => navigate('/order', { state: { product, quantity } })}
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
