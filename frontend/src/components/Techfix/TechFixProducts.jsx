import React, { useState, useEffect } from "react";
import { addTechFixProduct, getTechFixProducts } from "../Services/TechFix";
import Header from "./Header";

function TechFixProducts() {
  const [showAddProductCard, setShowAddProductCard] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: null,
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getTechFixProducts();
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails({ ...productDetails, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductDetails({ ...productDetails, image: e.target.files[0] });
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    for (const key in productDetails) {
      formData.append(key, productDetails[key]);
    }
    await addTechFixProduct(formData);
    setShowAddProductCard(false);
    const fetchedProducts = await getTechFixProducts();
    setProducts(fetchedProducts);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
    <Header />
    <div className="p-4">
      <button
        className="top-2 right-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        onClick={() => setShowAddProductCard(true)}
      >
        Add Product
      </button>
  
      {showAddProductCard && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg rounded-lg w-11/12 max-w-md">
          <h2 className="text-xl mb-4 text-gray-800 font-bold">Add Product</h2>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={productDetails.name}
            onChange={handleInputChange}
            className="mb-3 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="category"
            placeholder="Product Category"
            value={productDetails.category}
            onChange={handleInputChange}
            className="mb-3 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="price"
            placeholder="Product Price"
            value={productDetails.price}
            onChange={handleInputChange}
            className="mb-3 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="stock"
            placeholder="Product Stock"
            value={productDetails.stock}
            onChange={handleInputChange}
            className="mb-3 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="description"
            placeholder="Product Description"
            value={productDetails.description}
            onChange={handleInputChange}
            className="mb-3 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="mb-3 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleAddProduct}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Submit
            </button>
            <button
              onClick={() => setShowAddProductCard(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            {product.image && (
              <img
                src={`http://localhost:5000/${product.image}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-1"><span className="font-semibold">Category:</span> {product.category}</p>
            <p className="text-gray-600 mb-1"><span className="font-semibold">Price:</span> ${product.price}</p>
            <p className="text-gray-600 mb-1"><span className="font-semibold">Stock:</span> {product.stock}</p>
            <p className="text-gray-600"><span className="font-semibold">Description:</span> {product.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}

export default TechFixProducts;
