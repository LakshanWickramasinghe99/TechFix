import React, { useState, useEffect } from "react";
import Header from "./Header";
import { getSupProducts } from "../Services/TechFix"; // Import the searchProducts function

function Products() {
  const [productsList, setProductsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const productsList = await getSupProducts();
      setProductsList(productsList);
    };
    fetchProducts();
  }, []);

  const filteredProducts = productsList.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
  <Header />
  <div className="container mx-auto p-6">
    {/* Search Input */}
    <input
      type="text"
      placeholder="Search for products..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
    />

    {/* Product List */}
    <ul className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
      {searchQuery ? (
        filteredProducts.map((product) => (
          <li
            key={product.productId}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-800 font-medium">{product.name}</span>
          </li>
        ))
      ) : (
        <li className="p-4 text-gray-600">No search made yet</li>
      )}
    </ul>
  </div>
</div>
  );
}

export default Products;