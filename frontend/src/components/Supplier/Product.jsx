import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ isEdit, productId }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
    supplierId: localStorage.getItem('supplierId'),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch product data if editing
  useEffect(() => {
    if (isEdit && productId) {
      axios
        .get(`http://localhost:5000/api/product/${productId}`) // Correct URL to fetch product data by productId
        .then((response) => {
          setProduct(response.data);
        })
        .catch((err) => {
          setError('Failed to load product data.');
        });
    }
  }, [isEdit, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct((prevState) => ({
      ...prevState,
      image: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('stock', product.stock);
    formData.append('category', product.category);
    formData.append('supplierId', product.supplierId); // Supplier ID from localStorage

    if (product.image) {
      formData.append('image', product.image);
    }

    const url = isEdit
      ? `http://localhost:5000/api/product/${productId}` // Correct URL for editing
      : 'http://localhost:5000/api/product/create'; // URL for creating new product
    const method = isEdit ? 'put' : 'post';

    axios({
      method,
      url,
      data: formData,
    })
      .then((response) => {
        setLoading(false);
        navigate('/products'); // Redirect to the product list
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response?.data?.msg || 'Error saving product.');
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center">
        {isEdit ? 'Edit Product' : 'Create Product'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700">
              Product Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={product.name}
              onChange={handleChange}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-lg font-semibold text-gray-700">
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-semibold text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            rows="4"
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="block text-lg font-semibold text-gray-700">
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              value={product.category}
              onChange={handleChange}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-lg font-semibold text-gray-700">
              Stock Quantity
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              value={product.stock}
              onChange={handleChange}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-lg font-semibold text-gray-700">
            Product Image
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="mt-2 w-full text-sm text-gray-500 border border-gray-300 rounded-lg file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>

      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default ProductForm;
