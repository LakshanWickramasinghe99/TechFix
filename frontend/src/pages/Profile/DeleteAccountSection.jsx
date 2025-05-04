import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext'; 

const DeleteAccountModal = ({ isOpen, onClose, onDelete }) => {
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await onDelete(password);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-red-600 mb-4">Confirm Account Deletion</h3>
        <p className="mb-4">This action cannot be undone. All your data will be permanently deleted.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your password to confirm
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              autoComplete="current-password"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
              disabled={isDeleting || !password}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteAccountSection = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { backendUrl, setIsLoggedin, setUserData } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`, { withCredentials: true });
      setIsLoggedin(false);
      setUserData(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout properly');
    }
  };

  const handleDeleteAccount = async (password) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/profile/account`, {
        data: { password },
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data.success) {
        toast.success('Account deleted successfully');
        await handleLogout();
      } else {
        toast.error(response.data.message || 'Account deletion failed');
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      
      let errorMessage = 'Failed to delete account';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid password';
        } else {
          errorMessage = error.response.data?.message || 
                       `Server error (${error.response.status})`;
        }
      } else if (error.request) {
        errorMessage = 'No response from server - please check your connection';
      }
      
      toast.error(errorMessage);
      throw error; // Re-throw to let the modal know the operation failed
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="font-medium text-lg mb-6 flex items-center text-red-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Account
        </h2>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Warning: Deleting your account is permanent and cannot be undone. All your data will be removed from our systems.
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Delete My Account
        </button>
      </div>

      <DeleteAccountModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteAccount}
      />
    </>
  );
};

export default DeleteAccountSection;