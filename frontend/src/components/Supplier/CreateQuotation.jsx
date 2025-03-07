import { useState } from "react";
import axios from "axios";

const CreateQuotation = () => {
  const supplierId = localStorage.getItem("supplierId");  // Retrieve supplierId from localStorage
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([{ productId: "", quantity: 1, price: 0 }]);
  const [error, setError] = useState("");

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "customerName") {
      setCustomerName(value);
    } else if (name === "customerEmail") {
      setCustomerEmail(value);
    } else if (name === "totalPrice") {
      setTotalPrice(value);
    }
  };

  // Handle product input change
  const handleProductChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index][name] = value;
    setProducts(updatedProducts);
  };

  // Add new product field
  const handleAddProduct = () => {
    setProducts([...products, { productId: "", quantity: 1, price: 0 }]);
  };

  // Remove product field
  const handleRemoveProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  // Handle form submission to create a new quotation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the form is filled correctly
    if (!customerName || !customerEmail || !totalPrice || products.length === 0) {
      setError("Please fill in all fields correctly.");
      return;
    }

    const newQuotation = {
      customerName,
      customerEmail,
      totalPrice,
      products,
      supplierId, // Add supplierId to the quotation data
    };

    try {
      await axios.post("http://localhost:5000/api/quotation/create", newQuotation);
      setError("");
      alert("Quotation created successfully!");
      // Reset the form
      setCustomerName("");
      setCustomerEmail("");
      setTotalPrice(0);
      setProducts([{ productId: "", quantity: 1, price: 0 }]);
    } catch (error) {
      setError("Error creating quotation.");
      console.error("Error creating quotation:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Quotation</h2>
      
      {error && <p className="text-red-500 text-center">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Customer Details */}
        <div className="mb-4">
          <label className="block text-lg">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={customerName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md mt-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg">Customer Email</label>
          <input
            type="email"
            name="customerEmail"
            value={customerEmail}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md mt-2"
            required
          />
        </div>

        {/* Total Price */}
        <div className="mb-4">
          <label className="block text-lg">Total Price</label>
          <input
            type="number"
            name="totalPrice"
            value={totalPrice}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md mt-2"
            required
          />
        </div>

        {/* Products */}
        <div>
          <h3 className="text-xl font-semibold mt-4">Products</h3>
          {products.map((product, index) => (
            <div key={index} className="border p-4 my-4 rounded-md">
              <div className="mb-2">
                <label className="block">Product ID</label>
                <input
                  type="text"
                  name="productId"
                  value={product.productId}
                  onChange={(e) => handleProductChange(e, index)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(e, index)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="flex-1">
                  <label className="block">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={(e) => handleProductChange(e, index)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Remove product button */}
              <button
                type="button"
                onClick={() => handleRemoveProduct(index)}
                className="mt-4 bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700"
              >
                Remove Product
              </button>
            </div>
          ))}
        </div>

        {/* Add Product Button */}
        <button
          type="button"
          onClick={handleAddProduct}
          className="mt-4 bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-700"
        >
          Add Product
        </button>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Create Quotation
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuotation;
