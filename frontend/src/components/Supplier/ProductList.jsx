import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrash, FaPlus } from "react-icons/fa";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const supplierId = localStorage.getItem("supplierId");

  useEffect(() => {
    if (!supplierId) {
      setError("No supplier ID found. Please log in.");
      return;
    }
    fetchProducts();
  }, [supplierId]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/product?supplierId=${supplierId}`
      );
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setError("Unexpected response format. Expected an array.");
      }
    } catch (err) {
      setError("Error fetching products. Please try again later.");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      // Use the productId to send the delete request
      await axios.delete(`http://localhost:5000/api/product/${productId}`);
      setProducts(products.filter((product) => product.productId !== productId));
    } catch (err) {
      setError("Error deleting product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6 flex flex-col items-center relative">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold text-gray-900 mb-8 tracking-wide"
      >
        Your Products
      </motion.h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <motion.div
              key={product.productId}  // Use productId as the unique key here
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 border border-gray-200"
            >
              <img
                src={
                  product.image
                    ? `http://localhost:5000/uploads/${product.image}`
                    : "/default-image.jpg"
                }
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
                onError={(e) => (e.target.src = "/default-image.jpg")}
              />
              <h2 className="text-2xl font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 text-sm truncate">{product.description}</p>
              <p className="text-lg font-bold text-indigo-600 mt-2">${product.price}</p>
              <p className="text-sm text-gray-500">{product.category}</p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleDelete(product.productId)}  // Use productId for deletion
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-500 text-lg col-span-full text-center"
          >
            No products available.
          </motion.p>
        )}
      </motion.div>

      {/* Button to Create New Product */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute top-6 right-6 z-10"
      >
        <Link
          to="/create-product"
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <FaPlus className="text-lg" /> Create New Product
        </Link>
      </motion.div>
    </div>
  );
};

export default ProductList;
