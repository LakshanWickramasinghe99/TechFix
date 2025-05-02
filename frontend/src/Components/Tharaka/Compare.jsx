// Compare.jsx
import React, { useEffect, useState } from 'react';

const Compare = () => {
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('compareList')) || [];
    setCompareList(list);
  }, []);

  if (compareList.length === 0) {
    return <div className="text-center mt-20 text-gray-500">No products to compare</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Compare Products</h2>
      <button
        onClick={() => {
          localStorage.removeItem('compareList');
          setCompareList([]);
        }}
        className="mb-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
      >
        Clear Compare List
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {compareList.map((product, index) => (
          <div key={index} className="border p-4 rounded-md shadow-md bg-white">
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.title}
              className="w-full h-48 object-contain mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
            <p className="text-sm text-gray-500 mb-1">Brand: {product.brand}</p>
            <p className="text-xl text-red-600 font-bold mb-2">
              ${product.salePrice || product.price}
            </p>
            <ul className="text-sm text-gray-700">
              {product.description?.split('\n').map((line, i) => (
                <li key={i}>• {line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compare;
