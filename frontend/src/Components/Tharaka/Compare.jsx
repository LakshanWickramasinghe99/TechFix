import React, { useEffect, useState } from "react";

const Compare = () => {
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("compareList")) || [];
    setCompareList(stored);
  }, []);

  if (compareList.length === 0)
    return (
      <div className="text-center py-20 text-gray-500">
        No products to compare.
      </div>
    );

  // Collect all unique keys for table headers (excluding _id and image)
  const allKeys = Array.from(
    new Set(
      compareList.flatMap((p) =>
        Object.keys(p).filter(
          (k) =>
            ![
              "_id",
              "__v",
              "image",
              "createdAt",
              "updatedAt",
              "reviews",
              "description",
            ].includes(k)
        )
      )
    )
  );

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-8 text-center">
        Compare Products
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white shadow rounded-xl">
          <thead>
            <tr>
              <th className="p-4 border-b text-left">Feature</th>
              {compareList.map((product) => (
                <th key={product._id} className="p-4 border-b text-center">
                  <div className="flex flex-col items-center">
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.title}
                      className="w-24 h-24 object-contain mb-2"
                    />
                    <div className="font-semibold">{product.title}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Show price and salePrice first if present */}
            {["price", "salePrice", ...allKeys.filter(k => k !== "price" && k !== "salePrice")].map((key) => (
              <tr key={key}>
                <td className="p-4 border-b font-medium capitalize bg-gray-50">{key}</td>
                {compareList.map((product) => (
                  <td key={product._id + key} className="p-4 border-b text-center">
                    {product[key] !== undefined ? product[key].toString() : "-"}
                  </td>
                ))}
              </tr>
            ))}
            {/* Description row */}
            <tr>
              <td className="p-4 font-medium bg-gray-50">Description</td>
              {compareList.map((product) => (
                <td key={product._id + "desc"} className="p-4 text-center">
                  <div className="text-xs text-gray-700 whitespace-pre-line">
                    {product.description}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
