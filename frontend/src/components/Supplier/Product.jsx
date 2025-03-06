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
        .get(`http://localhost:5000/api/products/${productId}`) // Ensure the correct backend URL
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
    formData.append('supplierId',product.supplierId); // Replace with actual supplier ID from session or state

    if (product.image) {
      formData.append('image', product.image);
    }

    const url = isEdit
      ? `http://localhost:5000/api/products/${supplierId}` // Correct URL for editing
      : 'http://localhost:5000/api/product/create'; // Correct URL for creating new product
    const method = isEdit ? 'put' : 'post';

    axios({
      method,
      url,
      data: formData,
    })
      .then((response) => {
        setLoading(false);
        navigate('/products');
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response?.data?.msg || 'Error saving product.');
      });
  };

  return (
    <div>
      <h2>{isEdit ? 'Edit Product' : 'Create Product'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image</label>
          <input type="file" onChange={handleImageChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default ProductForm;
