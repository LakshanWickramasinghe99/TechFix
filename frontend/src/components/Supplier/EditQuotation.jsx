import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditQuotation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState({ customerName: "", customerEmail: "", products: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/quotation/${id}`)
      .then((res) => setQuotation(res.data))
      .catch(() => setError("Error fetching quotation."));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/quotation/${id}`, quotation);
      navigate("/quotations");
    } catch {
      setError("Error updating quotation.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Edit Quotation</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={quotation.customerName} onChange={(e) => setQuotation({ ...quotation, customerName: e.target.value })} className="border p-2 w-full" required />
        <input type="email" value={quotation.customerEmail} onChange={(e) => setQuotation({ ...quotation, customerEmail: e.target.value })} className="border p-2 w-full" required />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default EditQuotation;
