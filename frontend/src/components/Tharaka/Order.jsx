import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const [address, setAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const [quantity, setQuantity] = useState(1);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    try {
      const totalAmount = (product.salePrice || product.price) * quantity;

      const orderData = {
        customerId: "replace_with_logged_in_user_id",
        customerName: "replace_with_logged_in_user_name",
        customerEmail: "replace_with_logged_in_user_email",
        address,
        items: [
          {
            itemId: product._id,
            title: product.title,
            quantity,
            price: product.salePrice || product.price
          }
        ],
        totalAmount
      };

      const res = await axios.post('http://localhost:5000/api/orders', orderData);

      alert("Order placed successfully!");
      navigate('/'); // or to a confirmation page
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Something went wrong!");
    }
  };

  if (!product) return <div className="text-center mt-20 text-red-500">No product selected for order.</div>;

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>

      <div className="space-y-4 mb-8">
        {['street', 'city', 'postalCode', 'country'].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={address[field]}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        ))}
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2">Product</h3>
        <div className="flex items-center space-x-4">
          <img src={`http://localhost:5000${product.image}`} alt={product.title} className="w-24 h-24 object-contain" />
          <div>
            <p className="font-medium">{product.title}</p>
            <p>Price: ${product.salePrice || product.price}</p>
            <div className="flex items-center space-x-2 mt-2">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-16 border px-2 py-1 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleOrder}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderPage;
