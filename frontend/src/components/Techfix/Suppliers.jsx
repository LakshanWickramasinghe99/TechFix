import React, { useState } from 'react';
import Header from './Header';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([
        { id: 1, name: 'Supplier 1', details: 'Details of Supplier 1' },
        { id: 2, name: 'Supplier 2', details: 'Details of Supplier 2' },
        // Add more suppliers as needed
    ]);

    const handleEdit = (id) => {
        // Handle edit logic here
        console.log(`Edit supplier with id: ${id}`);
    };

    const handleAddSupplier = () => {
        // Handle add supplier logic here
        console.log('Add new supplier');
    };

    return (
        <div>
        <Header />
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Suppliers</h1>
                <button
                    onClick={handleAddSupplier}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Supplier
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map((supplier) => (
                    <div key={supplier.id} className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">{supplier.name}</h2>
                        <p className="text-gray-600">{supplier.details}</p>
                        <button
                            onClick={() => handleEdit(supplier.id)}
                            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default Suppliers;