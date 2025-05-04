import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Create context
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
            if (data.success) {
                setIsLoggedin(true);
                getUserData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to check auth state");
        }
    };

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/data`);
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message || "User data not available");
                setUserData(null);
            }
        } catch (error) {
            console.error('User data fetch error:', error);
            if (error.response) {
                if (error.response.status === 401) {
                    setIsLoggedin(false);
                    toast.error("Please login again");
                } else if (error.response.status === 500) {
                    toast.error("Server error - please try again later");
                }
            } else {
                toast.error("Network error - can't reach server");
            }
            setUserData(null);
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for consuming the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};