import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateQuotation = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [products, setProducts] = useState([{ name: "", price: 0, quantity: 1 }]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleProductChange = (index, key, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][key] = value;
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, { name: "", price: 0, quantity: 1 }]);
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/quotations", { customerName, customerEmail, products });
      navigate("/quotations");
    } catch (err) {
      setError("Error creating quotation.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Create Quotation</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="border p-2 w-full" required />
        <input type="email" placeholder="Customer Email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="border p-2 w-full" required />

        <h2 className="text-xl font-bold">Products</h2>
        {products.map((product, index) => (
          <div key={index} className="flex space-x-2">
            <input type="text" placeholder="Product Name" value={product.name} onChange={(e) => handleProductChange(index, "name", e.target.value)} className="border p-2 flex-1" required />
            <input type="number" placeholder="Price" value={product.price} onChange={(e) => handleProductChange(index, "price", parseFloat(e.target.value))} className="border p-2 w-24" required />
            <input type="number" placeholder="Quantity" value={product.quantity} onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value))} className="border p-2 w-24" required />
            {products.length > 1 && <button type="button" onClick={() => removeProduct(index)} className="bg-red-500 text-white p-2 rounded">Remove</button>}
          </div>
        ))}

        <button type="button" onClick={addProduct} className="bg-blue-500 text-white p-2 rounded">Add Product</button>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Create Quotation</button>
      </form>
    </div>
  );
};

export default CreateQuotation;
