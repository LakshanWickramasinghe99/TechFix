import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from './Header';

function Products() {
  const [productsList, setProductsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('http://localhost:5000/api/products/search');
      setProductsList(response.data);
    };
    fetchProducts();
  }, []);
  
  const filteredProducts = productsList.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ); 

  return (
    <div>
      <Header />
      <input
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul>
        {filteredProducts.map(product => (
          <li key={product._id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Products;
