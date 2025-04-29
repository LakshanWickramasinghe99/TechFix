import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import img from '../../../assets/mac.jpg'; // Placeholder image

const categories = [
  "Mobiles", "Laptops", "Watches", "Earphones", "Monitors",
  "PowerBanks", "Gaming", "Storages"
];

// Category icons mapping (you can add your own imports for actual icons)
const categoryIcons = {
  "Mobiles": "📱",
  "Laptops": "💻",
  "Watches": "⌚",
  "Earphones": "🎧",
  "Monitors": "🖥️",
  "PowerBanks": "🔋",
  "Gaming": "🎮",
  "Storages": "💾"
};

// Category colors for visual distinction
const categoryColors = {
  "Mobiles": "#FF6B6B",      // Coral Red
  "Laptops": "#4ECDC4",      // Caribbean Green
  "Watches": "#FFD166",      // Mustard Yellow
  "Earphones": "#6A0572",    // Deep Purple
  "Monitors": "#1A535C",     // Dark Teal
  "PowerBanks": "#F9C80E",   // Golden Yellow
  "Gaming": "#FF4365",       // Pink Red
  "Storages": "#3D5A80"      // Navy Blue
};

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovering, setIsHovering] = useState(null);
  const [notification, setNotification] = useState({ visible: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items");
        setItems(response.data);
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, visible: false });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      
      // Find the deleted product title for the notification
      const deletedItem = items.find(item => item._id === id);
      const itemTitle = deletedItem ? deletedItem.title : "Product";
      
      // Remove item from state
      setItems(items.filter((item) => item._id !== id));
      
      // Show success notification
      setNotification({
        visible: true,
        message: `"${itemTitle}" has been successfully deleted`,
        type: "success"
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      
      // Show error notification
      setNotification({
        visible: true,
        message: "Failed to delete product. Please try again.",
        type: "error"
      });
    }
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-8">
        {/* Delete Notification */}
        {notification.visible && (
          <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center max-w-md border-l-4 animate-slide-in-right ${
            notification.type === "success" 
              ? "bg-green-50 border-green-500 text-green-700" 
              : "bg-red-50 border-red-500 text-red-700"
          }`}>
            <div className="mr-3 text-2xl">
              {notification.type === "success" ? "✅" : "❌"}
            </div>
            <div>
              <p className="font-medium">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification({ ...notification, visible: false })}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        )}


        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">Product Collection</h2>
              <p className="text-indigo-100 mt-1">Manage your inventory with ease</p>
            </div>
            <Link 
              to="/admin/addproduct" 
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-50 transition duration-300 flex items-center"
            >
              <span className="mr-2">+</span> Add New Product
            </Link>
          </div>
        </div>

        {/* Category Filter Section */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Browse Categories</h3>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-3 rounded-xl font-medium transition duration-200 flex items-center ${
                !selectedCategory 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">🏠</span>
              All Categories
            </button>
            
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-3 rounded-xl font-medium transition duration-200 flex items-center ${
                  selectedCategory === category 
                    ? 'text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedCategory === category ? categoryColors[category] : ''
                }}
              >
                <span className="mr-2">{categoryIcons[category]}</span>
                {category}
              </button>
            ))}
          </div>
        </div>


        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            <p className="font-medium">Oops! {error}</p>
            <p>Please try again later or contact support.</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
              </h3>
              <p className="text-gray-600">{filteredItems.length} items found</p>
            </div>
            
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div 
                    key={item._id} 
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
                    onMouseEnter={() => setIsHovering(item._id)}
                    onMouseLeave={() => setIsHovering(null)}

                  >
                    <div className="relative">
                      {/* Category Badge */}
                      <div 
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-medium z-10"
                        style={{ backgroundColor: categoryColors[item.category] || '#4A5568' }}
                      >
                        <span className="mr-1">{categoryIcons[item.category]}</span>
                        {item.category}
                      </div>
                      
                      {/* Product Image with Overlay on Hover */}
                      <div className="relative">
                        <img 
                          src={item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/400x300'} 
                          alt={item.title} 
                          className="w-full h-64 object-cover transition duration-300"
                          style={{
                            transform: isHovering === item._id ? 'scale(1.05)' : 'scale(1)',
                            filter: isHovering === item._id ? 'brightness(0.9)' : 'brightness(1)'
                          }}
                        />
                        
                        {/* Quick Actions Overlay */}
                        {isHovering === item._id && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <button 
                              onClick={() => navigate(`/admin/productview/${item._id}`)}
                              className="bg-white text-gray-800 rounded-full p-3 mx-2 hover:bg-gray-100"
                              title="View Details"
                            >
                              👁️
                            </button>
                            <button 
                              onClick={() => navigate(`/admin/editproduct/${item._id}`)}
                              className="bg-white text-gray-800 rounded-full p-3 mx-2 hover:bg-gray-100"
                              title="Edit Product"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => deleteItem(item._id)}
                              className="bg-white text-gray-800 rounded-full p-3 mx-2 hover:bg-gray-100"
                              title="Delete Product"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{item.title}</h3>
                      <div className="flex justify-between items-center">
                        <div className="bg-indigo-100 rounded-full px-4 py-1 text-indigo-800 font-medium">
                          ${item.price.toLocaleString()}
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => navigate(`/admin/productview/${item._id}`)} 
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            View
                          </button>
                          <span className="text-gray-300">|</span>
                          <button 
                            onClick={() => navigate(`/admin/editproduct/${item._id}`)} 
                            className="text-green-600 hover:text-green-800 transition"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">|</span>
                          <button 
                            onClick={() => deleteItem(item._id)} 
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-2xl font-medium text-gray-700 mb-2">No products found</p>
                <p className="text-gray-500 mb-6">Try selecting a different category or add new products</p>
                <Link 
                  to="/admin/addproduct" 
                  className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
                >
                  Add Your First Product
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ItemList;