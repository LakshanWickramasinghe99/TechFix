import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";
import Logo from "../../assets/Techfix.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [profileOpen, setProfileOpen] = useState(false); // Profile dropdown state
  const [userName, setUserName] = useState(""); // Store logged-in user's name

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser); // Assuming user data is stored as JSON
      setUserName(userData.name || "User"); // Default to "User" if name is not found
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Remove user data
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <nav className="bg-[#1c4474] p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <img src={Logo} alt="TechFix Logo" className="h-10" />
          <span className="text-white text-xl font-bold">TECHFIX</span>
        </Link>

        {/* Desktop Navbar Links */}
        <ul className="hidden md:flex space-x-12 text-white justify-center flex-grow">
          <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
          <li><Link to="/products" className="hover:text-gray-200">Products</Link></li>
          <li><Link to="/quotations" className="hover:text-gray-200">Quotations</Link></li>
        </ul>

        {/* Profile Section */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <UserCircle size={36} className="text-white" />
            <span className="text-white hidden md:inline">{userName}</span> {/* Display User Name */}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2">
              <p className="px-4 py-2 font-semibold">{userName}</p>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-200">Logout</button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navbar Links */}
      {isOpen && (
        <ul className="md:hidden bg-[#1E4876] text-white text-center space-y-3 p-4">
          <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/products" onClick={() => setIsOpen(false)}>Products</Link></li>
          <li><Link to="/quotations" onClick={() => setIsOpen(false)}>Quotations</Link></li>
          <li><Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link></li>
          <li><button onClick={handleLogout} className="w-full text-left">Logout</button></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
