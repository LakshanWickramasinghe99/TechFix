import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Heart } from "lucide-react";

const SearchProduct = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    if (query) {
      fetchProducts();
    }
  }, [query]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/items/search/${query}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    }
  };

  return (
    <div className="p-4 mt-24">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for: <span className="text-blue-600">"{query}"</span>
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">
                  {product.title}
                </h2>
                <p className="text-gray-600 text-sm mb-2">
                  Brand: {product.brand}
                </p>
                <p className="text-blue-600 font-bold text-lg mb-3">
                  ${product.price}
                </p>
                <div className="flex justify-between items-center">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                    View Details
                  </button>
                  <Heart size={20} className="text-gray-600 cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
