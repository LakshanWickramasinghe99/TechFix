import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditQuotation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState({
    customerName: "",
    customerEmail: "",
    products: [],
    totalPrice: 0, // Add total price to state
  });
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/quotation/${id}`)
      .then((res) => setQuotation(res.data))
      .catch(() => setError("Error fetching quotation."));
  }, [id]);

  // Calculate the total price
  const calculateTotalPrice = () => {
    let total = 0;
    quotation.products.forEach((product) => {
      total += product.price * product.quantity;
    });
    setQuotation((prev) => ({ ...prev, totalPrice: total }));
  };

  const handleProductChange = (index, key, value) => {
    const updatedProducts = [...quotation.products];
    updatedProducts[index][key] = value;
    setQuotation((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
    calculateTotalPrice();
  };

  const handleAddProduct = () => {
    setQuotation((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { quantity: 1, price: 0 }, // New empty product (without productId)
      ],
    }));
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = quotation.products.filter((_, i) => i !== index);
    setQuotation((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
    calculateTotalPrice();
  };

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
        <div>
          <label className="block">Customer Name</label>
          <input
            type="text"
            value={quotation.customerName}
            onChange={(e) =>
              setQuotation({ ...quotation, customerName: e.target.value })
            }
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block">Customer Email</label>
          <input
            type="email"
            value={quotation.customerEmail}
            onChange={(e) =>
              setQuotation({ ...quotation, customerEmail: e.target.value })
            }
            className="border p-2 w-full"
            required
          />
        </div>

        <h2 className="text-xl font-semibold mt-4">Products</h2>

        {quotation.products.map((product, index) => (
          <div key={index} className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block">Quantity</label>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) =>
                  handleProductChange(index, "quantity", parseInt(e.target.value))
                }
                className="border p-2 w-full"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block">Price</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) =>
                  handleProductChange(index, "price", parseFloat(e.target.value))
                }
                className="border p-2 w-full"
                required
              />
            </div>

            <button
                type="button"
                onClick={() => handleRemoveProduct(index)}
                className="bg-red-500 text-white py-1 px-4 text-sm rounded"
                >
            Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddProduct}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Product
        </button>

        <div className="mt-4">
          <label className="block">Total Price</label>
          <input
            type="number"
            value={quotation.totalPrice}
            readOnly
            className="border p-2 w-full bg-gray-100"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded"
        >
          Update Quotation
        </button>
      </form>
    </div>
  );
};

export default EditQuotation;
