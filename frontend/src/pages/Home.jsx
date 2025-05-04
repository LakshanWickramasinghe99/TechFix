import React, { useContext, useEffect, useMemo, useState } from 'react';
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

    // Memoized user initial with fallback
    const userInitial = useMemo(() => {
        return userData?.name?.charAt(0)?.toUpperCase() || 'U';
    }, [userData]);

    // Fetch user data on login or token change
    useEffect(() => {
        let isMounted = true;

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${backendUrl}/api/user/data`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (isMounted && response.data.success && response.data.userData?.name) {
                    const name = response.data.userData.name.trim();
                    setUserData(prev => ({
                        ...prev,
                        name,
                        isAccountVerified: response.data.userData.isAccountVerified
                    }));
                } else if (isMounted) {
                    toast.error("Failed to fetch user data.");
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Error fetching user data:", error);
                    toast.error("Error fetching user data.");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (isLoggedin && token) {
            fetchUserData();
        }

        return () => {
            isMounted = false;
        };
    }, [isLoggedin, token, backendUrl, setUserData]);

    // Logout handler
    const handleLogout = async () => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen flex items-center justify-center">
            {isLoggedin ? (
                <>
                    {/* Dropdown Button */}
                    <div className="absolute top-5 right-5">
                        <button
                            aria-label="User menu"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-12 h-12 flex items-center justify-center bg-black text-white text-xl font-bold rounded-full hover:opacity-80 transition-all"
                        >
                            {userInitial}
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg text-sm z-10 overflow-hidden">
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        navigate('/profile');
                                    }}
                                    className="block w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        My Profile
                                    </div>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                                    disabled={loading}
                                >
                                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin h-4 w-4 mr-2 text-gray-500" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8h4z"></path>
                                            </svg>
                                            Logging out...
                                        </span>
                                    ) : 'Logout'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Home Content */}
                    <div className="text-center p-8">
                        <h1 className="text-4xl font-bold mb-6">Welcome back, {userData?.name || 'User'}</h1>
                        <p className="text-xl mb-8">You're now logged in to your account</p>
                    </div>
                </>
            ) : (
                <>
                    {/* Login Button */}
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
