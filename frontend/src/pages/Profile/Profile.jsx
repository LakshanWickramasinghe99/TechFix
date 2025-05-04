import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import Sidebar from './Sidebar';
import DetailsSection from './DetailsSection';
import AddressSection from './AddressSection';
import PurchasesSection from './PurchasesSection';
import ReportsSection from './ReportsSection';
import DeleteAccountSection from './DeleteAccountSection';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { userData, setUserData, backendUrl } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('details');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUserBasicData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/profile/basic`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setUserData(prev => ({
          ...prev,
          ...response.data.userData
        }));
      }
    } catch (error) {
      console.error("Failed to fetch basic user data:", error);
      if (error.response?.status === 401) {
        // Only redirect on 401 (Unauthorized)
        toast.error('Please login to view your profile');
        window.location.href = '/login';
      } else {
        toast.error(error.response?.data?.message || 'Failed to load basic profile data');
      }
    }
  };
  
  const fetchFullProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/profile`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setUserData(prev => ({
          ...prev,
          ...response.data.userData
        }));
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      if (error.response?.status === 401) {
        // Only redirect on 401 (Unauthorized)
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      } else if (error.response?.status === 404) {
        toast.error('Profile endpoint not found - contact support');
      } else {
        toast.error(error.response?.data?.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    try {
      const response = await axios.delete(`${backendUrl}/api/profile/account`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Clear user data and redirect
        setUserData(null);
        window.location.href = '/'; // Full page reload to clear all state
      }
    } catch (error) {
      console.error("Account deletion failed:", error);
      toast.error('Account deletion failed');
      setIsDeleteModalOpen(false);
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'details':
        return <DetailsSection userData={userData} setUserData={setUserData} />;
      case 'address':
        return <AddressSection userData={userData} setUserData={setUserData} />;
      case 'purchases':
        return <PurchasesSection userData={userData} />;
      case 'reports':
        return <ReportsSection userData={userData} />;
      case 'delete':
        return <DeleteAccountSection setIsDeleteModalOpen={setIsDeleteModalOpen} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Account Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAccountDeletion}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            userData={userData} 
          />
          
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;