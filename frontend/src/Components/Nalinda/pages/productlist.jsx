import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
    "Mobiles", "Laptops", "Watches", "Earphones", "Monitors",
    "PowerBanks", "Gaming", "Storages"
  ];
  

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <Link to="/admin/addproduct" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add New Product
        </Link>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-center text-xl text-gray-600">Loading products...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
                <div className="relative">
                  <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    {product.category}
                  </span>
                  <img 
                    src={product.image ? `http://localhost:5000${product.image}` : 'https://via.placeholder.com/200'} 
                    alt={product.title} 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                <p className="text-gray-700 mb-2">${product.price}</p>
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => navigate(`/product/${product._id}`)} 
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => navigate(`/admin/editproduct/${product._id}`)} 
                    className="text-green-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteProduct(product._id)} 
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-xl text-gray-600">No products found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
