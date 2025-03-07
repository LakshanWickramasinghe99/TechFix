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
    <div>
      <Header />
      <h1>Compare Quotations</h1>
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Customer Email</th>
            <th>Total Price</th>
            <th>Created At</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {quotations.map((quotation) => (
            <tr key={quotation._id}>
              <td>{quotation.customerName}</td>
              <td>{quotation.customerEmail}</td>
              <td>{quotation.totalPrice}</td>
              <td>{new Date(quotation.createdAt).toLocaleDateString()}</td>
              <td>
                <table>
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotation.products.map((product, index) => (
                      <tr key={index}>
                        <td>{product.productId}</td>
                        <td>{product.quantity}</td>
                        <td>{product.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompareQuotations;
