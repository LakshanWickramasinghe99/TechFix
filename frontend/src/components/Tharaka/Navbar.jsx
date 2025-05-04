import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Mic,
  ShoppingBag,
  User,
  Heart,
  ChevronDown,
} from "lucide-react";
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

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("Select Country");
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const categoriesRef = useRef(null);
  const brandsRef = useRef(null);

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

  const countries = [
    { name: "Sri Lanka", flag: "https://flagcdn.com/lk.svg" },
    { name: "Australia", flag: "https://flagcdn.com/au.svg" },
    { name: "Brazil", flag: "https://flagcdn.com/br.svg" },
    { name: "Canada", flag: "https://flagcdn.com/ca.svg" },
    { name: "France", flag: "https://flagcdn.com/fr.svg" },
    { name: "Germany", flag: "https://flagcdn.com/de.svg" },
    { name: "India", flag: "https://flagcdn.com/in.svg" },
    { name: "Japan", flag: "https://flagcdn.com/jp.svg" },
    { name: "United Kingdom", flag: "https://flagcdn.com/gb.svg" },
    { name: "United States", flag: "https://flagcdn.com/us.svg" },
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
    const handleClickOutside = (e) => {
      if (
        !categoriesRef.current?.contains(e.target) &&
        !brandsRef.current?.contains(e.target)
      ) {
        setActiveSection(null);
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

        <div className="flex items-center">
          <Heart size={24} className="text-gray-700 cursor-pointer mr-8" />
          <div className="relative mr-64 cursor-pointer" onClick={() => navigate("/cart")}>
            <ShoppingBag size={24} className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </div>
        </div>

        <div className="absolute top-7 right-4 flex items-center space-x-2">
          <User size={24} className="text-gray-600" />
          <span className="text-sm text-gray-500">Welcome</span>
          <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">
            Sign In / Register
          </a>
        </div>
      </nav>

      <div className="flex justify-end p-4 space-x-4 relative mt-24">
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
                      <img src={category.image} alt={category.name} className="w-6 h-6" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="relative" ref={brandsRef}>
          <button
            onClick={() => handleToggleSection("brands")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full shadow-md transition ${
              activeSection === "brands"
                ? "bg-[#3674B5] text-white"
                : "bg-gray-300 text-black hover:bg-gray-500"
            }`}
          >
            Brands <ChevronDown size={20} />
          </button>

          {activeSection === "brands" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="z-50 border-2 border-[#3674B5] rounded-lg bg-white shadow-md p-1 absolute right-0 mt-2 w-64"
            >
              <div className="max-h-72 overflow-y-auto">
                {brands.map((brand, index) => (
                  <button
                    key={index}
                    onClick={() => handleBrandClick(brand.name)}
                    className="flex items-center justify-between w-full p-3 hover:bg-gray-200 transition rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <img src={brand.image} alt={brand.name} className="w-6 h-6" />
                      <span className="text-sm font-medium">{brand.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => handleToggleSection("countries")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full shadow-md transition ${
              activeSection === "countries"
                ? "bg-[#3674B5] text-white"
                : "bg-gray-300 text-black hover:bg-gray-500"
            }`}
          >
            Deliver To <ChevronDown size={20} />
          </button>

          {activeSection === "countries" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="z-50 border-2 border-[#3674B5] rounded-lg bg-white shadow-md p-2 absolute right-0 mt-2 w-64"
            >
              <div className="max-h-72 overflow-y-auto">
                {countries
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((country, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedCountry(country.name);
                        setActiveSection(null);
                      }}
                      className="flex items-center gap-3 w-full p-2 hover:bg-gray-200 rounded-md"
                    >
                      <img
                        src={country.flag}
                        alt={country.name}
                        className="w-6 h-4 object-cover rounded-sm"
                      />
                      <span className="text-sm font-medium">{country.name}</span>
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {selectedCountry !== "Select Country" && (
        <div className="text-center mt-2 text-sm text-gray-700">
          Delivering to: <strong>{selectedCountry}</strong>
        </div>
      )}
    </div>
  );
};

export default Navbar;
