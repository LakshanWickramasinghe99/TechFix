import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const supplierId = localStorage.getItem('supplierId'); // Assuming supplierId is stored here

  useEffect(() => {
    if (!supplierId) {
      setError('No supplier ID found. Please log in.');
      return;
    }

    fetchProducts();
  }, [supplierId]);

  const fetchProducts = () => {
    axios.get(`http://localhost:5000/api/product/all?supplierId=${supplierId}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setError('Unexpected response format. Expected an array.');
        }
      })
      .catch((err) => {
        setError('Error fetching products.');
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/products/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product._id !== id));
      })
      .catch(() => {
        setError('Error deleting product.');
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Your Products</h1>
      {error && <p className="text-red-500">{error}</p>}

      {products.length > 0 ? (
        <table className="min-w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="border p-2">Image</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="border p-2">
                  <img
                    src={product.image ? `http://localhost:5000/uploads/${product.image}` : '/default-image.jpg'}
                    alt={product.name}
                    className="w-16 h-16 object-cover"
                    onError={(e) => e.target.src = '/default-image.jpg'} // Fallback in case of image load failure
                  />
                </td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.description}</td>
                <td className="border p-2">${product.price}</td>
                <td className="border p-2">{product.category}</td>
                <td className="border p-2">
                  <Link to={`/edit-product/${product._id}`} className="bg-blue-500 text-white p-2 rounded mr-2">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white p-2 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products available.</p>
      )}

      <div className="mt-4">
        <Link to="/create-product" className="bg-green-500 text-white p-2 rounded">
          Create New Product
        </Link>
      </div>
    </div>
  );
};

export default Products;
