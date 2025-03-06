import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UserCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../assets/Techfix.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [profileOpen, setProfileOpen] = useState(false); // Profile dropdown state
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [userName, setUserName] = useState(""); // Store logged-in user's name
  const dropdownRef = useRef(null); // Ref for detecting outside clicks

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserName(userData.name || "User");
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <nav className="bg-[#1c4474] shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3">
          <img src={Logo} alt="TechFix Logo" className="h-10" />
          <span className="text-white text-xl font-bold tracking-wide">TECHFIX</span>
        </Link>

        {/* Search Bar (Hidden on mobile, visible on medium+ screens) */}
        <div className="hidden md:flex items-center bg-white px-4 py-1 rounded-lg shadow-sm w-96">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 text-gray-800 focus:outline-none"
          />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-white text-lg font-medium">
          <li><Link to="/" className="hover:text-gray-200 transition">Home</Link></li>
          <li><Link to="/products" className="hover:text-gray-200 transition">Products</Link></li>
          <li><Link to="/quotations" className="hover:text-gray-200 transition">Quotations</Link></li>
        </ul>

        {/* Profile Section */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setProfileOpen((prev) => !prev)}
          >
            <UserCircle size={36} className="text-white" />
            <span className="text-white hidden md:inline">{userName}</span>
          </button>

          {/* Profile Dropdown with Animation */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2"
              >
                <p className="px-4 py-2 font-semibold">{userName}</p>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-200">Logout</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#1E4876] text-white text-center space-y-3 p-4"
          >
            {/* Search Bar in Mobile Menu */}
            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
              <Search size={20} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-2 text-gray-800 focus:outline-none"
              />
            </div>

            <ul className="space-y-2">
              <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
              <li><Link to="/products" onClick={() => setIsOpen(false)}>Products</Link></li>
              <li><Link to="/quotations" onClick={() => setIsOpen(false)}>Quotations</Link></li>
              <li><Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link></li>
              <li>
                <button onClick={handleLogout} className="w-full text-left">Logout</button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
