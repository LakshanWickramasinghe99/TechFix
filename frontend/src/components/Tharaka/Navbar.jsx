import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Mic,
  ShoppingBag,
  User,
  Heart,
  ChevronDown,
  Package, // Order Icon
} from "lucide-react";
import logo from "../../assets/logo.png";

// Category Images
import mobilesImg from "../../assets/cell-phone.png";
import laptopsImg from "../../assets/laptop.png";
import watchImg from "../../assets/smart-watch.png";
import earphoneImg from "../../assets/earphone.png";
import monitorImg from "../../assets/monitor.png";
import powerbankImg from "../../assets/powerbank.png";
import gamingImg from "../../assets/games.png";
import HDDImg from "../../assets/hdd.png";

// Brand Images
import appleImg from "../../assets/apple.png";
import samsungImg from "../../assets/samsung.png";
import hpImg from "../../assets/hp.png";
import huaweiImg from "../../assets/huawei.png";
import sonyImg from "../../assets/sony.png";
import lenovoImg from "../../assets/lenovo.png";
import oppoImg from "../../assets/oppo.png";
import oneplus from "../../assets/one-plus.png";
import xiomi from "../../assets/xiaomi.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const categories = [
    { name: "Mobiles", image: mobilesImg },
    { name: "Laptops", image: laptopsImg },
    { name: "Watches", image: watchImg },
    { name: "Earphones", image: earphoneImg },
    { name: "Monitors", image: monitorImg },
    { name: "PowerBanks", image: powerbankImg },
    { name: "Gaming", image: gamingImg },
    { name: "Storages", image: HDDImg },
  ];

  const brands = [
    { name: "Apple", image: appleImg },
    { name: "Samsung", image: samsungImg },
    { name: "Sony", image: sonyImg },
    { name: "HP", image: hpImg },
    { name: "Lenovo", image: lenovoImg },
    { name: "Huawei", image: huaweiImg },
    { name: "Oppo", image: oppoImg },
    { name: "OnePlus", image: oneplus },
    { name: "Xiaomi", image: xiomi },
  ];

  const handleToggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div>
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between p-4 border-0 border-[#3674B5] shadow-md bg-white relative">
        {/* Logo */}
        <div className="flex items-center">
    
          <img
            src={logo}
            alt="TechFix"
            className="w-40 h-auto cursor-pointer"
            onClick={() => navigate('/')}
          />
        
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 mx-4 max-w-lg">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full p-2 pl-4 pr-12 border-2 border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3674B5] shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-12 text-gray-500"
              >
                ✖
              </button>
            )}
            <Mic className="absolute right-4 text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Icons Section */}
        <div className="flex items-center">
          {/* Wishlist Icon */}
          <Heart size={24} className="text-gray-700 cursor-pointer mr-8" />

          {/* Order Icon - NEW */}
          <Package
            size={24}
            className="text-gray-700 cursor-pointer mr-8"
            onClick={() => navigate('/order-details')} // Navigate to Orders Page
          />

          {/* Shopping Cart Icon */}
          <ShoppingBag size={24} className="text-gray-700 cursor-pointer mr-64"
          onClick={() => navigate('/cart')} />
        </div>

        {/* Login/Register */}
        <div className="absolute top-7 right-4 flex items-center space-x-2">
          <User size={24} className="text-gray-600" />
          <span className="text-sm text-gray-500">Welcome</span>
          <a
            href="#"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Sign In / Register
          </a>
        </div>
      </nav>

      {/* Browse Categories / Brands Buttons */}
      <div className="flex justify-end p-4 space-x-4 relative">
        {/* Categories Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => handleToggleSection("categories")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full shadow-md transition ${
              activeSection === "categories"
                ? "bg-[#3674B5] text-white"
                : activeSection === "brands"
                ? "bg-gray-700 text-white" // Dark background for inactive section when "brands" is active
                : "bg-gray-300 text-black hover:bg-gray-500"
            }`}
          >
            Browse Categories <ChevronDown size={20} />
          </button>

          {/* Category Dropdown */}
          {activeSection === "categories" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="z-50 border-2 border-[#3674B5] rounded-lg bg-white shadow-md p-4 absolute left-0 mt-2 w-64"
            >
              <div className="max-h-72 overflow-y-auto">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="flex items-center justify-between w-full p-3 hover:bg-gray-200 transition rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-6 h-6"
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Brands Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => handleToggleSection("brands")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full shadow-md transition ${
              activeSection === "brands"
                ? "bg-[#3674B5] text-white"
                : activeSection === "categories"
                ? "bg-gray-700 text-white" // Dark background for inactive section when "categories" is active
                : "bg-gray-300 text-black hover:bg-gray-500"
            }`}
          >
            Brands <ChevronDown size={20} />
          </button>

          {/* Brand Dropdown */}
          {activeSection === "brands" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="z-50 border-2 border-[#3674B5] rounded-lg bg-white shadow-md p-1 absolute left-0 mt-2 w-64"
              style={{ left: "initial", right: 0 }} // Align with the button on the right
            >
              <div className="max-h-72 overflow-y-auto">
                {brands.map((brand, index) => (
                  <button
                    key={index}
                    className="flex items-center justify-between w-full p-3 hover:bg-gray-200 transition rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="w-6 h-6"
                      />
                      <span className="text-sm font-medium">{brand.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
