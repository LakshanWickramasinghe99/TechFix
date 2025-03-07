import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CreateQuotation = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [products, setProducts] = useState([{ name: "", price: 0, quantity: 1 }]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleProductChange = (index, key, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][key] = value;
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, { name: "", price: 0, quantity: 1 }]);
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  // Function to calculate the total price for each product
  const calculateTotalPrice = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  // Function to calculate the total price of all products
  const calculateTotalQuotationPrice = () => {
    return products.reduce((acc, product) => acc + product.price * product.quantity, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/quotations", { customerName, customerEmail, products });
      navigate("/quotations");
    } catch (err) {
      setError("Error creating quotation.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl p-8 rounded-2xl shadow-2xl space-y-8 flex flex-col"
      >
        {/* Form Section */}
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold text-center text-gray-800">Create Quotation</h1>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg text-gray-700 mb-2" htmlFor="customerName">Customer Name</label>
              <input
                id="customerName"
                type="text"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-lg text-gray-700 mb-2" htmlFor="customerEmail">Customer Email</label>
              <input
                id="customerEmail"
                type="email"
                placeholder="Enter customer email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Products</h2>
              {products.map((product, index) => (
                <div key={index} className="flex space-x-4 items-center mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={product.name}
                      onChange={(e) => handleProductChange(index, "name", e.target.value)}
                      className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Price"
                      value={product.price}
                      onChange={(e) => handleProductChange(index, "price", parseFloat(e.target.value))}
                      className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value))}
                      className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div className="w-32">
                    <span className="text-gray-700 font-bold">
                      Total: ${calculateTotalPrice(product.price, product.quantity)}
                    </span>
                  </div>

                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 focus:outline-none"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addProduct}
                className="bg-[#1c4474] text-white p-4 rounded-lg shadow-md hover:bg-[#1a3a5c] focus:outline-none w-full"
              >
                Add Product
              </button>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-green-500 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-green-600 focus:outline-none w-full"
              >
                Create Quotation
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Total Price Box */}
      <div className="fixed bottom-6 right-6 bg-white p-6 rounded-xl shadow-lg max-w-xs w-full">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Quotation Total</h3>
        <p className="text-lg font-bold text-gray-800">
          Total Price: ${calculateTotalQuotationPrice()}
        </p>
      </div>
    </div>
  );
};

export default CreateQuotation;
