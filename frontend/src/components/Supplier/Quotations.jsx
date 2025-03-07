import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const Quotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/quotation/all");
      setQuotations(response.data);
    } catch (err) {
      setError("Error fetching quotations.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quotation?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/quotation/${id}`);
      setQuotations(quotations.filter((quotation) => quotation._id !== id));
    } catch (err) {
      setError("Error deleting quotation.");
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
        Quotations
      </motion.h1>

      {error && <p className="text-red-500">{error}</p>}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {quotations.length > 0 ? (
          quotations.map((quotation) => (
            <motion.div
              key={quotation._id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 border border-gray-200"
            >
              <h2 className="text-2xl font-semibold text-gray-800">{quotation.customerName}</h2>
              <p className="text-gray-700">📧 {quotation.customerEmail}</p>
              <p className="text-green-600 font-bold text-xl">💰 ${quotation.totalPrice}</p>

              <div className="flex justify-between mt-4">
                <Link
                  to={`/edit-quotation/${quotation._id}`}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                >
                  <FaEdit /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(quotation._id)}
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
            No quotations available.
          </motion.p>
        )}
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute top-6 right-6" // This is the key change
      >
        <Link
          to="/create-quotation"
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <FaPlus className="text-lg" /> Create New Quotation
        </Link>
      </motion.div>
    </div>
  );
};

export default Quotations;
