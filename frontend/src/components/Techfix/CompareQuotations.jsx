import React, { useEffect, useState } from "react";
import { getAllQuotations } from "../Services/TechFix";
import Header from "./Header";

const CompareQuotations = () => {
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    const fetchQuotations = async () => {
      const data = await getAllQuotations();
      setQuotations(data);
    };

    fetchQuotations();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
  <Header />
  <div className="container mx-auto p-6">
    {/* Heading */}
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Compare Quotations</h1>

    {/* Quotations Table */}
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Products
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {quotations.map((quotation) => (
            <tr key={quotation._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-800">{quotation.customerName}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{quotation.customerEmail}</td>
              <td className="px-6 py-4 text-sm text-gray-800">${quotation.totalPrice}</td>
              <td className="px-6 py-4 text-sm text-gray-800">
                {new Date(quotation.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {quotation.products.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-800">{product.productId}</td>
                          <td className="px-4 py-2 text-sm text-gray-800">{product.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-800">${product.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
  );
};

export default CompareQuotations;
