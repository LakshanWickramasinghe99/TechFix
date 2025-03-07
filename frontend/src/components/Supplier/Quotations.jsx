import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";

const QuotationDetails = () => {
  const supplierId = localStorage.getItem("supplierId");
  const [quotations, setQuotations] = useState([]); // Storing all quotations
  const [error, setError] = useState("");
  const [editingQuotation, setEditingQuotation] = useState(null); // To store the quotation being edited

  useEffect(() => {
    const fetchQuotations = async () => {
      if (!supplierId) {
        setError("Supplier ID is missing.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/quotation/${supplierId}`);
        if (Array.isArray(response.data)) {
          setQuotations(response.data);
        } else {
          setError("Quotation data format is invalid.");
        }
      } catch (err) {
        setError("Error fetching quotations.");
        console.error("Error fetching quotations:", err);
      }
    };

    fetchQuotations();
  }, [supplierId]);

  // Show loading state if quotations are being fetched
  if (quotations.length === 0 && !error) {
    return <p className="text-center mt-4 text-xl text-gray-500">Loading...</p>;
  }

  // Show error message if there's an error
  if (error) {
    return <p className="text-red-500 text-center mt-4 text-xl">{error}</p>;
  }

  // Handle Edit Quotation: Trigger form for editing
  const handleEditQuotation = (quotationIndex) => {
    const quotationToEdit = quotations[quotationIndex];
    setEditingQuotation({ ...quotationToEdit, index: quotationIndex });
  };

  // Handle editing form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingQuotation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle updating products
  const handleProductChange = (e, productIndex) => {
    const { name, value } = e.target;
    const updatedProducts = [...editingQuotation.products];
    updatedProducts[productIndex] = {
      ...updatedProducts[productIndex],
      [name]: value,
    };
    setEditingQuotation((prevState) => ({
      ...prevState,
      products: updatedProducts,
    }));
  };

  // Handle saving the edited quotation
  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/quotation/${editingQuotation._id}`, editingQuotation);
      const updatedQuotations = [...quotations];
      updatedQuotations[editingQuotation.index] = editingQuotation; // Update the edited quotation
      setQuotations(updatedQuotations);
      setEditingQuotation(null); // Close the edit form
    } catch (error) {
      console.error("Error saving edited quotation:", error);
    }
  };

  // Handle canceling the edit
  const handleCancelEdit = () => {
    setEditingQuotation(null); // Close the edit form without saving
  };

  // Handle Remove Product
  const handleRemoveProduct = (quotationIndex, productIndex) => {
    const updatedQuotations = [...quotations];
    updatedQuotations[quotationIndex].products.splice(productIndex, 1); // Remove the product
    setQuotations(updatedQuotations);
  };

  // Handle Remove Quotation
  const handleRemoveQuotation = async (quotationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/quotation/${quotationId}`); // Make sure this endpoint supports DELETE
      const updatedQuotations = quotations.filter((quotation) => quotation._id !== quotationId);
      setQuotations(updatedQuotations); // Remove the deleted quotation from the state
    } catch (error) {
      console.error("Error deleting quotation:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Quotation Details</h2>

      {/* Create Quotation Button */}
      <div className="flex justify-center mb-6">
        <Link to="/create-quotation" className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700">
          Create a New Quotation
        </Link>
      </div>

      {editingQuotation ? (
        <div className="mb-8 p-6 border border-gray-300 rounded-xl shadow-sm bg-gray-50">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Edit Quotation</h3>
          <div className="mb-4">
            <label className="block text-lg">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={editingQuotation.customerName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mt-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg">Customer Email</label>
            <input
              type="email"
              name="customerEmail"
              value={editingQuotation.customerEmail}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mt-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg">Total Price</label>
            <input
              type="number"
              name="totalPrice"
              value={editingQuotation.totalPrice}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mt-2"
            />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Products</h4>
            {editingQuotation.products.map((product, productIndex) => (
              <div key={productIndex} className="border border-gray-200 p-4 my-2 rounded-md bg-white shadow-md">
                <p className="text-lg text-gray-700"><strong>Product ID:</strong> {product.productId}</p>

                <div className="flex gap-4 mt-2">
                  <div className="flex-1">
                    <label className="block">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(e, productIndex)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={(e) => handleProductChange(e, productIndex)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveProduct(editingQuotation.index, productIndex)}
                  className="mt-4 bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700"
                >
                  Remove Product
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleSaveEdit}
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        quotations.map((quotation, quotationIndex) => (
          <div key={quotationIndex} className="mb-8 p-6 border border-gray-300 rounded-xl shadow-sm bg-gray-50">
            <div className="mb-4">
              <h3 className="text-2xl font-semibold text-gray-800">Quotation #{quotationIndex + 1}</h3>
              <p className="text-lg text-gray-600"><strong>Customer Name:</strong> {quotation.customerName}</p>
              <p className="text-lg text-gray-600"><strong>Customer Email:</strong> {quotation.customerEmail}</p>
              <p className="text-lg text-gray-800 font-bold"><strong>Total Price:</strong> ${quotation.totalPrice}</p>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Products</h4>
              <ul>
                {quotation.products.length === 0 ? (
                  <p className="text-center text-lg text-gray-500">No products available for this quotation.</p>
                ) : (
                  quotation.products.map((product, productIndex) => (
                    <li key={productIndex} className="border border-gray-200 p-4 my-2 rounded-md bg-white shadow-md">
                      <p className="text-lg text-gray-700"><strong>Product ID:</strong> {product.productId}</p>
                      <p className="text-lg text-gray-700"><strong>Quantity:</strong> {product.quantity}</p>
                      <p className="text-lg text-gray-700"><strong>Price:</strong> ${product.price}</p>

                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => handleEditQuotation(quotationIndex)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveProduct(quotationIndex, productIndex)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Remove Product
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleRemoveQuotation(quotation._id)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Remove Quotation
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default QuotationDetails;
