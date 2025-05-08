import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  "Mobiles", "Laptops", "Watches", "Earphones", "Monitors",
  "PowerBanks", "Gaming", "Storages"
];

// Sample brand data - in a real app, this might come from an API
const brands = [
  "Apple", "Samsung", "Dell", "HP", "Sony", 
  "Lenovo", "Asus", "Logitech", "Microsoft", "LG"
];

// Color palette for categories
const categoryColors = {
  "Mobiles": "#4F46E5",      // Indigo
  "Laptops": "#0891B2",      // Cyan
  "Watches": "#7C3AED",      // Violet
  "Earphones": "#EC4899",    // Pink
  "Monitors": "#10B981",     // Emerald
  "PowerBanks": "#F59E0B",   // Amber
  "Gaming": "#EF4444",       // Red
  "Storages": "#6366F1"      // Indigo
};

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ visible: false, message: "", type: "" });
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Refs for dropdown clickaway detection
  const categoryDropdownRef = useRef(null);
  const brandDropdownRef = useRef(null);

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

  // Handle clicks outside of dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target)) {
        setBrandDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // Toggle dropdown states
  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
    if (brandDropdownOpen) setBrandDropdownOpen(false);
  };

  const toggleBrandDropdown = () => {
    setBrandDropdownOpen(!brandDropdownOpen);
    if (categoryDropdownOpen) setCategoryDropdownOpen(false);
  };

  // Apply both category and brand filters
  const filteredItems = items.filter((item) => {
    // Apply category filter if selected
    const categoryMatches = selectedCategory ? item.category === selectedCategory : true;
    
    // Apply brand filter if selected (assuming item has a brand property)
    const brandMatches = selectedBrand ? (item.brand === selectedBrand) : true;
    
    // Item passes filter if it matches both criteria
    return categoryMatches && brandMatches;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {notification.visible && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg flex items-center space-x-3 max-w-md ${
            notification.type === "success" 
              ? "bg-green-50 border-l-4 border-green-500 text-green-700" 
              : "bg-red-50 border-l-4 border-red-500 text-red-700"
          }`}>
            <div className="flex-shrink-0">
              {notification.type === "success" ? (
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1 ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification({ ...notification, visible: false })}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-500"
            >
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">TechStore Inventory</h1>
              <p className="mt-1 text-gray-600">Comprehensive product management system</p>
            </div>
            <Link 
              to="/admin/addproduct" 
              className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Product
            </Link>
          </div>
        </div>

        {/* Compact Filters Section */}
        <div className="bg-white shadow rounded-lg mb-6 p-4 border border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <button 
                onClick={toggleCategoryDropdown}
                className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-[180px]"
              >
                <span className="flex items-center">
                  {selectedCategory ? (
                    <>
                      <span 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: categoryColors[selectedCategory] }}
                      ></span>
                      {selectedCategory}
                    </>
                  ) : (
                    'All Categories'
                  )}
                </span>
                <svg className={`h-5 w-5 text-gray-400 ml-2 transition-transform ${categoryDropdownOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {categoryDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1 max-h-60 overflow-y-auto">
                    <button 
                      onClick={() => {
                        setSelectedCategory(null);
                        setCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 flex items-center"
                    >
                      All Categories
                    </button>
                    
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setCategoryDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 flex items-center"
                      >
                        <span 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: categoryColors[category] }}
                        ></span>
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Brand Dropdown */}
            <div className="relative" ref={brandDropdownRef}>
              <button 
                onClick={toggleBrandDropdown}
                className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 min-w-[180px]"
              >
                <span>
                  {selectedBrand ? selectedBrand : 'All Brands'}
                </span>
                <svg className={`h-5 w-5 text-gray-400 ml-2 transition-transform ${brandDropdownOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {brandDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1 max-h-60 overflow-y-auto">
                    <button 
                      onClick={() => {
                        setSelectedBrand(null);
                        setBrandDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                    >
                      All Brands
                    </button>
                    
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => {
                          setSelectedBrand(brand);
                          setBrandDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Clear Filters Button */}
            {(selectedCategory || selectedBrand) && (
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedBrand(null);
                }}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
          
          {/* Active Filter Badges */}
          {(selectedCategory || selectedBrand) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedCategory && (
                <div 
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white"
                  style={{ backgroundColor: categoryColors[selectedCategory] }}
                >
                  {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory(null)} 
                    className="ml-1.5 text-white focus:outline-none"
                  >
                    <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              
              {selectedBrand && (
                <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                  {selectedBrand}
                  <button 
                    onClick={() => setSelectedBrand(null)} 
                    className="ml-1.5 text-purple-600 focus:outline-none"
                  >
                    <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <p className="text-sm text-red-600">Please try again later or contact support.</p>
              </div>
            </div>
          </div>
        )}

        {/* Product List */}
        {!loading && !error && (
          <>
            <div className="mb-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-500">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedCategory ? `${selectedCategory}` : 'All Categories'}
                  {selectedBrand ? ` × ${selectedBrand}` : ''}
                </h2>
                <p className="text-sm text-gray-500">Displaying {filteredItems.length} products</p>
              </div>
            </div>
            
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div 
                    key={item._id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative">
                      {/* Category Badge */}
                      <div 
                        className="absolute top-2 right-2 px-2 py-1 text-white text-xs font-medium rounded-md"
                        style={{ backgroundColor: categoryColors[item.category] || '#4A5568' }}
                      >
                        {item.category}
                      </div>
                      
                      {/* Brand Badge (if available) */}
                      {item.brand && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-white bg-opacity-80 text-gray-800 text-xs font-medium rounded-md border border-gray-200">
                          {item.brand}
                        </div>
                      )}
                      
                      {/* Product Image */}
                      <img 
                        src={item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/400x300?text=Product+Image'} 
                        alt={item.title} 
                        className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">{item.title}</h3>
                      
                      {/* Price and Stock */}
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-lg font-bold" style={{ color: categoryColors[item.category] || '#4F46E5' }}>
                          ${item.price.toLocaleString()}
                        </p>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                          {item.stock || 'In Stock'}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-between border-t pt-3 mt-3">
                        <button 
                          onClick={() => navigate(`/admin/productview/${item._id}`)} 
                          className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          View
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/editproduct/${item._id}`)} 
                          className="flex items-center text-green-600 hover:text-green-800 font-medium text-sm"
                        >
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteItem(item._id)} 
                          className="flex items-center text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-10 text-center border border-gray-200">
                <div className="mx-auto h-24 w-24 text-gray-300 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                  <svg className="h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-gray-900 mb-2">No products found</p>
                
                {(selectedCategory || selectedBrand) ? (
                  <div>
                    <p className="text-gray-600 mb-6">No matches for your current filter selection:</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {selectedCategory && (
                        <span 
                          className="px-3 py-1.5 rounded-full text-sm text-white"
                          style={{ backgroundColor: categoryColors[selectedCategory] }}
                        >
                          Category: {selectedCategory}
                        </span>
                      )}
                      
                      {selectedBrand && (
                        <span className="px-3 py-1.5 rounded-full text-sm bg-purple-100 text-purple-800">
                          Brand: {selectedBrand}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedBrand(null);
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="mt-1 text-gray-600 mb-8">Your inventory is empty. Add your first product to get started.</p>
                    <Link 
                      to="/admin/addproduct" 
                      className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-md text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Your First Product
                    </Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ItemList;