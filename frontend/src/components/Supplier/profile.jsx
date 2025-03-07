import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaEdit, FaTrash
} from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/suppliers/me", { withCredentials: true });
        setUser(res.data);
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) setProfileImage(savedImage);
        setUpdatedInfo({
          name: res.data.supplier.name,
          email: res.data.supplier.email,
          phone: res.data.supplier.phone,
          address: res.data.supplier.address,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setProfileImage(imageUrl);
        localStorage.setItem("profileImage", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedData = { ...updatedInfo };
      await axios.put(`http://localhost:5000/api/suppliers/${user.supplier.supplierId}`, updatedData, { withCredentials: true });
      setUser({ supplier: updatedData });
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      try {
        await axios.delete(`http://localhost:5000/api/suppliers/${user.supplier.supplierId}`);
        alert("Profile deleted successfully");
        setUser(null);
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo({ ...updatedInfo, [name]: value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('https://png.pngtree.com/thumb_back/fh260/background/20230521/pngtree-computer-store-in-a-black-and-white-setting-image_2661262.jpg')" }}>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105"
      >
        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative"
          >
            <img 
              src={profileImage || "https://via.placeholder.com/150"} 
              alt="Profile" 
              className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-md"
            />
            <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition">
              <FaCamera />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-800 mt-4">Profile</h2>
        </div>

        {user && user.supplier ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="mt-6 space-y-5"
          >
            {[
              { icon: FaUser, field: "name", label: "Name", color: "text-blue-600" },
              { icon: FaEnvelope, field: "email", label: "Email", color: "text-green-600" },
              { icon: FaPhone, field: "phone", label: "Phone", color: "text-purple-600" },
              { icon: FaMapMarkerAlt, field: "address", label: "Address", color: "text-red-600" }
            ].map(({ icon: Icon, field, label, color }) => (
              <div key={field} className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg shadow-sm">
                <Icon className={`text-xl ${color}`} />
                {isEditing ? (
                  <input 
                    type="text" 
                    name={field} 
                    value={updatedInfo[field]} 
                    onChange={handleChange} 
                    className="w-full text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-gray-700">
                    <strong>{label}:</strong> {user.supplier[field] || <span className="text-red-500">Not provided</span>}
                  </p>
                )}
              </div>
            ))}

            <div className="flex justify-between mt-6">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
                className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition"
              >
                <FaEdit /> {isEditing ? "Save" : "Update"}
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={handleDelete} 
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
              >
                <FaTrash /> Delete
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }} 
            className="text-center text-gray-500 animate-pulse mt-4"
          >
            Loading...
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
