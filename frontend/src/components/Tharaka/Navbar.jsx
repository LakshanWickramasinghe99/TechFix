import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mic,
  ShoppingBag,
  User,
  Heart,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";

import mobilesImg from "../../assets/cell-phone.png";
import laptopsImg from "../../assets/laptop.png";
import watchImg from "../../assets/smart-watch.png";
import earphoneImg from "../../assets/earphone.png";
import monitorImg from "../../assets/monitor.png";
import powerbankImg from "../../assets/powerbank.png";
import gamingImg from "../../assets/games.png";
import HDDImg from "../../assets/hdd.png";

import appleImg from "../../assets/apple.png";
import samsungImg from "../../assets/samsung.png";
import hpImg from "../../assets/hp.png";
import huaweiImg from "../../assets/huawei.png";
import sonyImg from "../../assets/sony.png";
import lenovoImg from "../../assets/lenovo.png";
import oppoImg from "../../assets/oppo.png";
import oneplus from "../../assets/one-plus.png";
import xiomi from "../../assets/xiaomi.png";

import SearchBar from "../Yevin/Search";

const Navbar = () => {
  
  const [activeSection, setActiveSection] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const categoriesRef = useRef(null);
  const brandsRef = useRef(null);
  const profileRef = useRef(null);

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
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const handleBrandClick = (brandName) => {
    setActiveSection(null);
    navigate(`/?brand=${encodeURIComponent(brandName)}`);
  };

  const handleCategoryClick = (categoryName) => {
    setActiveSection(null);
    navigate(`/?category=${encodeURIComponent(categoryName)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    setProfileMenuOpen(false);
    navigate("/");
  };

 

  

  useEffect(() => {
    const updateCart = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalCount = storedCart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalCount);
    };

    updateCart();
    window.addEventListener("storage", updateCart);
    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !categoriesRef.current?.contains(e.target) &&
        !brandsRef.current?.contains(e.target) &&
        !profileRef.current?.contains(e.target)
      ) {
        setActiveSection(null);
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md flex items-center justify-between p-4">
        <div className="flex items-center">
          <img
            src={logo}
            alt="TechFix"
            className="w-40 h-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <div className="relative flex-1 mx-4 max-w-lg">
          <SearchBar />
        </div>
        

        <div className="flex items-center">
          <Heart size={24} className="text-gray-700 cursor-pointer mr-8" />
          <div
            className="relative mr-8 cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <ShoppingBag size={24} className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            {userId ? (
              <>
                <User
                  size={28}
                  className="text-gray-600 cursor-pointer"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                />
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-300 z-50 p-2"
                    >
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="flex items-center gap-2 w-full p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <User size={18} /> Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <a
                href="#"
                className="text-sm font-semibold text-blue-600 hover:underline"
                onClick={() => navigate("/login")}
              >
                Sign In / Register
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Browse buttons */}
      <div className="flex justify-end p-4 space-x-4 relative mt-24">
        {/* Categories */}
        <div className="relative" ref={categoriesRef}>
          <button
            onClick={() => handleToggleSection("categories")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full shadow-md transition ${
              activeSection === "categories"
                ? "bg-[#3674B5] text-white"
                : "bg-gray-300 text-black hover:bg-gray-500"
            }`}
          >
            Browse Categories <ChevronDown size={20} />
          </button>
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
                    onClick={() => handleCategoryClick(category.name)}
                    className="flex items-center justify-between w-full p-3 hover:bg-gray-200 transition rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-8 h-8 object-cover rounded-full"
                      />
                      <span>{category.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Brands */}
        <div className="relative" ref={brandsRef}>
          <button
            onClick={() => handleToggleSection("brands")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full shadow-md transition ${
              activeSection === "brands"
                ? "bg-[#3674B5] text-white"
                : "bg-gray-300 text-black hover:bg-gray-500"
            }`}
          >
            Browse Brands <ChevronDown size={20} />
          </button>
          {activeSection === "brands" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="z-50 border-2 border-[#3674B5] rounded-lg bg-white shadow-md p-4 absolute left-0 mt-2 w-64"
            >
              <div className="max-h-72 overflow-y-auto">
                {brands.map((brand, index) => (
                  <button
                    key={index}
                    onClick={() => handleBrandClick(brand.name)}
                    className="flex items-center justify-between w-full p-3 hover:bg-gray-200 transition rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="w-8 h-8 object-cover rounded-full"
                      />
                      <span>{brand.name}</span>
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
