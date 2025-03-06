import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
    try {
      await axios.delete(`http://localhost:5000/api/quotation/${id}`);
      setQuotations(quotations.filter((quotation) => quotation._id !== id));
    } catch (err) {
      setError("Error deleting quotation.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Quotations</h1>
      {error && <p className="text-red-500">{error}</p>}

      {quotations.length > 0 ? (
        <table className="min-w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="border p-2">Customer Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Total Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((quotation) => (
              <tr key={quotation._id}>
                <td className="border p-2">{quotation.customerName}</td>
                <td className="border p-2">{quotation.customerEmail}</td>
                <td className="border p-2">${quotation.totalPrice}</td>
                <td className="border p-2">
                  <Link to={`/edit-quotation/${quotation._id}`} className="bg-blue-500 text-white p-2 rounded mr-2">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(quotation._id)} className="bg-red-500 text-white p-2 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No quotations available.</p>
      )}

      <div className="mt-4">
        <Link to="/create-quotation" className="bg-green-500 text-white p-2 rounded">
          Create New Quotation
        </Link>
      </div>
    </div>
  );
};

export default Quotations;
