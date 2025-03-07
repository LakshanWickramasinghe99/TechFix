import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Hardcoded admin credentials
    const adminEmail = "admin@example.com";
    const adminPassword = "admin123";

    if (email === adminEmail && password === adminPassword) {
      alert("Admin login successful!");
      navigate("/techHome"); // Change this to your admin path
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/suppliers/login",
        { email, password },
        { withCredentials: true }
      );

      const { supplierId, name } = res.data;

      if (!supplierId) {
        console.error("Error: supplierId is missing in the response", res.data);
        alert("Login failed: No supplier ID received");
        console.error("Error: supplierId is missing in the response", res.data);
        alert("Login failed: No supplier ID received");
        return;
      }

      if (!name) {
        console.error(
          "Error: supplier name is missing in the response",
          res.data
        );
        alert("Login failed: No supplier name received");
        return;
      }

      alert(`Login successful! Welcome, ${name}`);

      localStorage.setItem("supplierId", supplierId);

      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed! Please check your credentials.");
    }
  };

  const navigateToRegister = () => {
    navigate("/register"); // Navigate to the register page
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-300"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          
          Login
        
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Login
          </motion.button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={navigateToRegister}
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Register here
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
