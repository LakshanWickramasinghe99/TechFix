import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Function to remove an item from the cart
  const handleRemoveItem = (index) => {
    // Remove the item from the cart by filtering out the selected index
    const updatedCart = cart.filter((_, itemIndex) => itemIndex !== index);

    // Update local storage with the new cart
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Reload the component to reflect changes
    window.location.reload();
  };

  // Function to handle checkout
  const handleCheckout = () => {
    // Navigate to checkout page or proceed with the order process
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600">Your cart is empty.</div>
      ) : (
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <ul>
            {cart.map((item, index) => (
              <li key={index} className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img 
                    src={item.product.image} 
                    alt={item.product.title} 
                    className="w-16 h-16 object-contain mr-4" 
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.product.title}</h2>
                    <p className="text-gray-600">LKR {item.product.price}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-red-600">
                  LKR {item.product.price * item.quantity}
                </p>
                {/* Remove Button */}
                <button 
                  className="ml-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-800 transition"
                  onClick={() => handleRemoveItem(index)}
                >
                  🗑️ Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <button 
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
