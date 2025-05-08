import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    }
  });

  const userToken = localStorage.getItem('token');
  const customerId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userToken) {
      toast.error('Please log in to proceed with checkout');
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${userToken}` }
      })
      .then((res) => {
        setCartItems(res.data.cart?.items || []);
      })
      .catch(() => toast.error('Failed to load cart'))
      .finally(() => setLoading(false));
  }, [userToken, navigate]);

  const getTotal = () =>
    cartItems.reduce((sum, item) => {
      if (!item.product) return sum;
      return sum + item.product.salePrice * item.quantity;
    }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.address) {
      setForm({ ...form, address: { ...form.address, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.customerName ||
      !form.customerEmail ||
      !form.phone ||
      Object.values(form.address).some((v) => !v)
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    const validItems = cartItems.filter(item => item.product);

    const order = {
      customerId,
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      phone: form.phone,
      address: form.address,
      items: validItems.map((item) => ({
        productId: item.product._id,
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.salePrice
      })),
      totalAmount: getTotal()
    };

    try {
      await axios.post('http://localhost:5000/api/orders', order);
      toast.success('Order placed successfully');
      navigate('/');
    } catch (err) {
      toast.error('Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6 text-sm text-gray-600 cursor-pointer" onClick={() => navigate('/cart')}>
        <span className="mr-2">&larr;</span> Back to Cart
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Shipping Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4">1 Shipping</h2>

            <div className="border p-4 rounded-lg mb-6">
              <p className="font-semibold">{form.customerName || 'Full Name'}</p>
              <p className="text-gray-600">{form.customerEmail || 'Email Address'}</p>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-sm">
              Not available for Collection
            </div>

            <div className="flex items-center gap-3 mb-6">
              <button className="flex-1 bg-blue-50 border border-blue-500 text-blue-700 font-medium py-2 rounded-lg">Delivery</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="customerName" value={form.customerName} onChange={handleChange} placeholder="Full Name" className="border p-3 rounded-lg w-full" />
                <input type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} placeholder="Email Address" className="border p-3 rounded-lg w-full" />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="border p-3 rounded-lg w-full col-span-2" />
                <input type="text" name="country" value={form.address.country} onChange={handleChange} placeholder="Country" className="border p-3 rounded-lg w-full" />
                <input type="text" name="city" value={form.address.city} onChange={handleChange} placeholder="City" className="border p-3 rounded-lg w-full" />
                <input type="text" name="postalCode" value={form.address.postalCode} onChange={handleChange} placeholder="Postal Code" className="border p-3 rounded-lg w-full" />
                <input type="text" name="street" value={form.address.street} onChange={handleChange} placeholder="Street Name" className="border p-3 rounded-lg w-full" />
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">Confirm Address</button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold">2 Payment</h2>
            <p className="text-gray-600 mt-2">Select your payment method at the next step.</p>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            {cartItems.map((item, idx) => (
              item.product && (
                <div key={idx} className="flex items-center border-b py-3">
                  <img src={`http://localhost:5000${item.product.image}`} alt={item.product.title} className="w-20 h-20 object-contain border rounded mr-4" />
                  <div className="flex-1">
                    <p className="font-medium">{item.product.title}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm text-red-600">SAR {item.product.salePrice}</p>
                  </div>
                </div>
              )
            ))}

            <div className="text-sm mt-4">
              <div className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>SAR {getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-green-600 font-semibold">
                <span>Cash Saving</span>
                <span>- SAR 0.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg py-2 border-t mt-2">
                <span>Total</span>
                <span>SAR {getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer payment icons */}
          <div className="bg-white rounded-xl shadow p-4 flex flex-wrap justify-center gap-4">
            {['Apple Pay', 'Visa', 'MasterCard', 'Mada'].map((name, i) => (
              <div key={i} className="text-sm text-gray-500">{name}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
