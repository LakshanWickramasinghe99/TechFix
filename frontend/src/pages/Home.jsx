import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Home = () => {
    const navigate = useNavigate();
    const { userData, backendUrl, setIsLoggedin, setUserData, isLoggedin, token } = useContext(AppContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userInitial, setUserInitial] = useState(''); // Define the state for the user's initial

    // Fetch user data when component mounts or token changes
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true); // Show loading state
            try {
                const response = await axios.get(`${backendUrl}/api/user/data`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log("API Response:", response.data); // Debugging

                if (response.data.success && response.data.userData?.name) {
                    const name = response.data.userData.name.trim();
                    console.log("Fetched User Name:", name); // Debugging

                    setUserData(prev => ({
                        ...prev,
                        name,
                        isAccountVerified: response.data.userData.isAccountVerified
                    }));
                } else {
                    toast.error("Failed to fetch user data.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Error fetching user data.");
            } finally {
                setLoading(false); // Hide loading state
            }
        };

        if (isLoggedin && token) {
            fetchUserData();
        }
    }, [isLoggedin, token, backendUrl, setUserData]);

    // Ensure userInitial updates when userData.name changes
    useEffect(() => {
        if (userData?.name) {
            setUserInitial(userData.name.charAt(0).toUpperCase()); // Set user initial
        }
    }, [userData]);

    const handleLogout = async () => {
        setLoading(true); // Show loading state during logout
        try {
            await axios.post(`${backendUrl}/api/auth/logout`, {}, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("You have successfully logged out!");
            setIsLoggedin(false);
            setUserData(null);
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Error logging out.");
        } finally {
            setLoading(false); // Hide loading state after logout
        }
    };

    return (
        <div className="relative h-screen flex items-center justify-center">
            {isLoggedin ? (
                <>
                    {/* Logged-in User Dropdown */}
                    <div className="absolute top-5 right-5">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-12 h-12 flex items-center justify-center bg-black text-white text-xl font-bold rounded-full hover:opacity-80 transition-all"
                        >
                            {userInitial} {/* Display user initial */}
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg text-sm z-10">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                    disabled={loading} // Disable logout button while loading
                                >
                                    {loading ? 'Logging out...' : 'Logout'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Logged-in Home Content */}
                    <div className="text-center p-8">
                        <h1 className="text-4xl font-bold mb-6">Welcome back, {userData?.name || 'User'}</h1>
                        <p className="text-xl mb-8">You're now logged in to your account</p>
                    </div>
                </>
            ) : (
                <>
                    {/* Login Button for non-logged-in users */}
                    <button
                        onClick={() => navigate('/login')}
                        className="absolute top-5 right-5 px-6 py-3 bg-gray-500 text-white border-2 border-gray-700 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-400 hover:border-gray-600 transition-all"
                    >
                        <span>Login</span>
                        <span className="text-xl">&rarr;</span>
                    </button>

                    {/* Public Home Content */}
                    <div className="text-center p-8">
                        <h1 className="text-4xl font-bold mb-6">Welcome to Our App</h1>
                        <p className="text-xl mb-8">Please login to access your account</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go to Login
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
