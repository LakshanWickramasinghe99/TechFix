import React, { useState, useEffect } from "react";
import Header from "./Header";
import { getTechFixProducts, createQuotation } from "../Services/TechFix";

const RequestQuotation = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([
    { _id: "", name: "", quantity: 1 },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getTechFixProducts();
      setProducts(products);
    };
    fetchProducts();
  }, []);

  const handleProductChange = (index, field, value) => {
    const newSelectedProducts = [...selectedProducts];
    if (field === "_id") {
      const selectedProduct = products.find((product) => product._id === value);
      newSelectedProducts[index]._id = value;
      newSelectedProducts[index].name = selectedProduct
        ? selectedProduct.name
        : "";
    } else {
      newSelectedProducts[index][field] = value;
    }
    setSelectedProducts(newSelectedProducts);
  };

  const addProductField = () => {
    setSelectedProducts([
      ...selectedProducts,
      { _id: "", name: "", quantity: 1 },
    ]);
  };

  const removeProductField = (index) => {
    const newSelectedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(newSelectedProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createQuotation({ products: selectedProducts });
      console.log("Quotation created successfully:", response);
      alert("Quotation created successfully");
      // Reset the form
      setSelectedProducts([{ _id: "", name: "", quantity: 1 }]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error creating quotation:", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
  <Header />
  <form onSubmit={handleSubmit} className="p-4 max-w-4xl mx-auto">
    {/* Search Input */}
    <input
      type="text"
      placeholder="Search products"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {/* Selected Products */}
    {selectedProducts.map((selectedProduct, index) => (
      <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Product Dropdown */}
          <select
            value={selectedProduct._id}
            onChange={(e) =>
              handleProductChange(index, "_id", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a product</option>
            {filteredProducts.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>

          {/* Quantity Input */}
          <input
            type="number"
            value={selectedProduct.quantity}
            onChange={(e) =>
              handleProductChange(index, "quantity", e.target.value)
            }
            min="1"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => removeProductField(index)}
            className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    ))}

    {/* Add Another Product Button */}
    <button
      type="button"
      onClick={addProductField}
      className="w-full mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Add Another Product
    </button>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
    >
      Submit
    </button>
  </form>
</div>
  );
};

export default RequestQuotation;
