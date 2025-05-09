import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract search params from URL
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("term") || "";
  const priceOperator = queryParams.get("operator") || null;
  const priceValue = queryParams.get("value")
    ? parseFloat(queryParams.get("value"))
    : null;

  const isPriceFilterActive = priceOperator && priceValue !== null;

  useEffect(() => {
    console.log("Search params:", {
      searchTerm,
      priceOperator,
      priceValue,
      isPriceFilterActive,
    });
    const fetchAndFilterProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/items");
        const allProducts = response.data; // Fix: Access the data property of the axios response

        // Apply filters
        const filtered = allProducts.filter((product) => {
          // Text search filter
          const matchesText = searchTerm
            ? (product.title
                ? product.title.toLowerCase().includes(searchTerm.toLowerCase())
                : false) ||
              (product.description
                ? product.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                : false) ||
              (product.category
                ? product.category
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                : false) ||
              (product.brand
                ? product.brand.toLowerCase().includes(searchTerm.toLowerCase())
                : false)
            : true;

          // Price filter
          if (isPriceFilterActive && matchesText) {
            const productPrice = parseFloat(product.price);

            switch (priceOperator) {
              case ">":
                return productPrice > priceValue;
              case "<":
                return productPrice < priceValue;
              case "=":
                return productPrice === priceValue;
              default:
                return true;
            }
          }

          return matchesText;
        });

        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterProducts();
  }, [searchTerm, priceOperator, priceValue, isPriceFilterActive]);

  const handleBackToProducts = () => {
    navigate("/"); // Change to match your actual route
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Search Results</h2>
            <p className="text-gray-600">
              {isPriceFilterActive ? (
                <span>
                  Showing results for "{searchTerm}" with price
                  {priceOperator === ">"
                    ? " greater than "
                    : priceOperator === "<"
                    ? " less than "
                    : " equal to "}
                  ${priceValue}
                </span>
              ) : (
                <span>Showing results for "{searchTerm}"</span>
              )}
            </p>
          </div>
          <button
            onClick={handleBackToProducts}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Back to Products
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.5 15.5l-4-4m-2-2a8 8 0 110 16 8 8 0 010-16z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mt-4">
              No products found
            </h3>
            <p className="text-gray-500 mt-2">
              {isPriceFilterActive
                ? `We couldn't find any "${searchTerm}" products ${
                    priceOperator === ">"
                      ? "above"
                      : priceOperator === "<"
                      ? "below"
                      : "equal to"
                  } $${priceValue}.`
                : `We couldn't find any products matching "${searchTerm}".`}
            </p>
            <button
              onClick={handleBackToProducts}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Back to All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer transform hover:scale-105 transition-transform duration-200"
              >
                {product.image && (
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Category:</span>{" "}
                  {product.category}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Brand:</span> {product.brand}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Price:</span> ${product.price}
                </p>

                <p className="text-gray-600 line-clamp-2">
                  <span className="font-semibold">Description:</span>{" "}
                  {product.description}
                </p>
                <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
