import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaEdit, FaTrash } from "react-icons/fa";

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
      const res = await axios.put(
        `http://localhost:5000/api/suppliers/${user.supplier.supplierId}`,
        updatedData,
        { withCredentials: true }
      );
      setUser(res.data);
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
    setUpdatedInfo({
      ...updatedInfo,
      [name]: value,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center p-6" style={{ backgroundImage: "url('https://png.pngtree.com/thumb_back/fh260/background/20230521/pngtree-computer-store-in-a-black-and-white-setting-image_2661262.jpg')" }}>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <div className="flex flex-col items-start">
          <div className="relative">
            <img
              src={profileImage || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-md hover:scale-110 transition-transform"
            />
            <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition">
              <FaCamera />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mt-4">Profile</h2>
        </div>

        {user && user.supplier ? (
          <div className="mt-6 space-y-5">
            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg shadow-sm">
              <FaUser className="text-blue-600 text-xl" />
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={updatedInfo.name}
                  onChange={handleChange}
                  className="text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-700"><strong>Name:</strong> {user.supplier.name}</p>
              )}
            </div>
            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg shadow-sm">
              <FaEnvelope className="text-green-600 text-xl" />
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={updatedInfo.email}
                  onChange={handleChange}
                  className="text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-700"><strong>Email:</strong> {user.supplier.email}</p>
              )}
            </div>
            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg shadow-sm">
              <FaPhone className="text-purple-600 text-xl" />
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={updatedInfo.phone}
                  onChange={handleChange}
                  className="text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-700"><strong>Phone:</strong> {user.supplier.phone || <span className="text-red-500">Not provided</span>}</p>
              )}
            </div>
            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg shadow-sm">
              <FaMapMarkerAlt className="text-red-600 text-xl" />
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={updatedInfo.address}
                  onChange={handleChange}
                  className="text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-700"><strong>Address:</strong> {user.supplier.address || <span className="text-red-500">Not provided</span>}</p>
              )}
            </div>

            <div className="flex justify-between mt-6">
              {isEditing ? (
                <button onClick={handleUpdate} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition">
                  <FaEdit /> Save
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition">
                  <FaEdit /> Update
                </button>
              )}

              <button onClick={handleDelete} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 animate-pulse mt-4">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;