import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Supplier Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
