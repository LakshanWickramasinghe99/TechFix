import React, { useEffect, useState } from "react";
import { getTechQuotations, deleteQuotation } from "../Services/TechFix";
import Header from "./Header";

const PastQuotation = () => {
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const data = await getTechQuotations();
      if (data && Array.isArray(data.quotations)) {
        setQuotations(data.quotations);
      } else {
        console.error("Fetched data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuotation(id);
      fetchQuotations(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting quotation:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
    <Header />
    <div className="container mx-auto p-6">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Past Quotations</h1>
  
      {/* Quotations List */}
      <ul className="space-y-4">
        {Array.isArray(quotations) &&
          quotations.map((quotation) => (
            <li
              key={quotation._id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Quotation ID */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Quotation ID: {quotation._id}
              </h2>
  
              {/* Created Date */}
              <p className="text-gray-600 mb-4">
                Created Date: {new Date(quotation.createdDTM).toLocaleString()}
              </p>
  
              {/* Products List */}
              <h3 className="text-lg font-medium text-gray-800 mb-2">Products:</h3>
              <ul className="space-y-2">
                {quotation.products.map((product) => (
                  <li
                    key={product._id}
                    className="text-gray-600"
                  >
                    {product.name} - Quantity: {product.quantity}
                  </li>
                ))}
              </ul>
  
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(quotation._id)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  </div>
  );
};

export default PastQuotation;
