import React, { useState } from "react";
import Header from "./Header";
import { useEffect } from "react";
import { getAllSuppliers } from "../Services/TechFix";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const allSuppliers = await getAllSuppliers();
        console.log("Suppliers:", allSuppliers);
        setSuppliers(allSuppliers);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleEdit = (id) => {
    // Handle edit logic here
    console.log(`Edit supplier with id: ${id}`);
  };

  const handleAddSupplier = () => {
    // Handle add supplier logic here
    console.log("Add new supplier");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
  <Header />
  <div className="p-4">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {suppliers.map((supplier) => (
        <div
          key={supplier.id}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{supplier.name}</h2>
          <p className="text-gray-600 mb-1"><span className="font-medium">Email:</span> {supplier.email}</p>
          <p className="text-gray-600 mb-1"><span className="font-medium">Phone:</span> {supplier.phone}</p>
          <p className="text-gray-600"><span className="font-medium">Address:</span> {supplier.address}</p>
        </div>
      ))}
    </div>
  </div>
</div>
  );
};

export default Suppliers;
