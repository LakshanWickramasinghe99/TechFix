import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoCartSharp } from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [userToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const saveCartToLocalStorage = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const updateBackendCart = async (updatedCart) => {
    if (!userToken) return;
    try {
      await axios.post('http://localhost:5000/api/cart', { items: updatedCart }, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
    } catch (err) {
      console.error('Failed to update backend cart:', err);
    }
  };

  const handleRemoveItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    saveCartToLocalStorage(updatedCart);
    updateBackendCart(updatedCart);
    toast.success('Item removed');
  };

  const handleQuantityChange = (index, delta) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = Math.max(1, updatedCart[index].quantity + delta);
    saveCartToLocalStorage(updatedCart);
    updateBackendCart(updatedCart);
    toast.info('Quantity updated');
  };

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warning('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-10">
      <h1 className="text-3xl font-semibold flex items-center mb-6">
        <IoCartSharp className="text-grey-500" size={30} />
        Cart <span className="ml-2 text-lg text-gray-500">({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-500 text-xl mt-16">Your cart is empty.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="bg-white border rounded-lg shadow-sm p-4 flex justify-between items-start">
                <div className="flex gap-4">
                  <img
                    src={`http://localhost:5000${item.product.image}`}
                    alt={item.product.title}
                    className="w-24 h-24 object-contain"
                  />
                  <div className="space-y-2 max-w-md">
                    <h2 className="text-lg font-semibold">{item.product.title}</h2>

                    <div className="inline-block bg-gray-100 text-sm text-gray-700 px-3 py-1 rounded-full shadow-sm">
                      {item.product.description}
                    </div>


                    <div className="flex flex-wrap gap-1 text-sm text-blue-600">
                      <span className="bg-blue-100 px-2 py-0.5 rounded">Bluetooth</span>
                      <span className="bg-blue-100 px-2 py-0.5 rounded">USB-C</span>
                      <span className="bg-blue-100 px-2 py-0.5 rounded">Mic</span>
                      <span className="bg-blue-100 px-2 py-0.5 rounded">Grey</span>
                    </div>

                    <div className="text-sm mt-1 text-green-700 bg-green-100 px-2 py-0.5 rounded w-max">
                      Save: $ {item.product.price - item.product.salePrice}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full">
                  <div className="text-right">
                    <p className="text-red-600 font-bold text-lg">
                      $ {item.product.salePrice}
                    </p>
                    <p className="text-sm line-through text-gray-400">$ {item.product.price}</p>
                  </div>

                  {/* Quantity Buttons */}
                  <div className="flex items-center mt-4 space-x-2">
                    <button
                      onClick={() => handleQuantityChange(index, -1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(index, 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-sm text-red-500 hover:underline mt-2"
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Panel */}
          <div className="bg-white border rounded-lg shadow-md p-6 space-y-4">
            <div className="text-sm space-y-1">
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>LKR {getTotalPrice()}</span>
              </p>
              <p className="flex justify-between">
                <span>Total Shipping Fees</span>
                <span>$ 15</span>
              </p>
              <p className="flex justify-between">
                <span>Custom Duty</span>
                <span>$ 20.00</span>
              </p>
            </div>

            <div className="border-t pt-3">
              <p className="text-xl font-bold text-red-600 flex justify-between">
                Grand Total
                <span>LKR {getTotalPrice() + 80 + 342.88}</span>
              </p>
              <p className="text-xs text-gray-500">exclusive of VAT</p>
            </div>

            <div className="flex gap-2">
              <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm">💳 Add Card</button>
              <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm">🏷️ Add Coupon</button>
            </div>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
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
