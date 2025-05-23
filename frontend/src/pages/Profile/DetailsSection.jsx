import React, { useState, useEffect, useRef, useMemo } from 'react';
import { countries as countryData } from 'countries-list';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const DetailsSection = ({ userData, setUserData }) => {
  // Memoize the country list to prevent recreation on every render
  const countryList = useMemo(() => 
    Object.values(countryData)
      .map(country => country.name)
      .sort(), 
    []
  );

  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [countrySearchDetails, setCountrySearchDetails] = useState('');
  const [showCountryDropdownDetails, setShowCountryDropdownDetails] = useState(false);
  const [filteredCountriesDetails, setFilteredCountriesDetails] = useState(countryList);
  const [highlightedIndexDetails, setHighlightedIndexDetails] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(!userData);
  
  const countryDropdownDetailsRef = useRef(null);
  const countryInputDetailsRef = useRef(null);

  // Memoize birth years calculation
  const birthYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  }, []);

  // Initialize form data with userData or empty values
  const [formData, setFormData] = useState(() => ({
    email: userData?.email || '',
    nickname: userData?.nickname || '',
    birthyear: userData?.birthyear || '',
    gender: userData?.gender || 'Prefer not to say',
    country: userData?.country || '',
  }));

  // Load user data if not provided
  useEffect(() => {
    if (!userData) {
      const loadUserData = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${API_BASE_URL}/api/user`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setUserData(response.data.user);
          setFormData({
            email: response.data.user?.email || '',
            nickname: response.data.user?.nickname || '',
            birthyear: response.data.user?.birthyear || '',
            gender: response.data.user?.gender || 'Prefer not to say',
            country: response.data.user?.country || '',
          });
        } catch (error) {
          console.error('Failed to load user data:', error);
          toast.error('Failed to load user data');
        } finally {
          setIsLoading(false);
        }
      };
      loadUserData();
    }
  }, [userData, setUserData]);

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        email: userData.email || '',
        nickname: userData.nickname || '',
        birthyear: userData.birthyear || '',
        gender: userData.gender || 'Prefer not to say',
        country: userData.country || '',
      });
    }
  }, [userData]);

  // Country filtering effects
  useEffect(() => {
    setFilteredCountriesDetails(
      countrySearchDetails 
        ? countryList.filter(c => c.toLowerCase().includes(countrySearchDetails.toLowerCase()))
        : countryList
    );
  }, [countrySearchDetails, countryList]);

  // Handle keyboard navigation for country dropdown
  const handleKeyDownDetails = (e) => {
    if (!showCountryDropdownDetails) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        setShowCountryDropdownDetails(true);
      }
      return;
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndexDetails(prev => 
        prev < filteredCountriesDetails.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndexDetails(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndexDetails >= 0) {
        handleCountrySelectDetails(filteredCountriesDetails[highlightedIndexDetails]);
      }
    } else if (e.key === 'Escape') {
      setShowCountryDropdownDetails(false);
    }
  };

  const handleCountrySelectDetails = (country) => {
    if (!countryList.includes(country)) {
      setError('Please select a valid country from the list');
      return;
    }
    setFormData(prev => ({ ...prev, country }));
    setCountrySearchDetails('');
    setShowCountryDropdownDetails(false);
    setHighlightedIndexDetails(-1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form validation
  const validateForm = () => {
    const { nickname, birthyear, country, gender } = formData;
    
    if (nickname && nickname.length < 2) {
      return 'Nickname must be at least 2 characters';
    }
  
    if (birthyear && (isNaN(birthyear) || birthyear < 1900 || birthyear > new Date().getFullYear())) {
      return 'Please enter a valid birth year between 1900 and current year';
    }
  
    if (country && !countryList.includes(country)) {
      return 'Please select a valid country from the list';
    }
  
    if (gender && !['Male', 'Female', 'Other', 'Prefer not to say'].includes(gender)) {
      return 'Please select a valid gender option';
    }
  
    return null;
  };

  // Save details to backend
  const handleSaveDetails = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSaving(true);
      
      const payload = {
        nickname: formData.nickname || '',
        birthyear: formData.birthyear ? Number(formData.birthyear) : null,
        gender: formData.gender || 'Prefer not to say',
        country: formData.country || ''
      };
  
      const response = await axios.put(
        `${API_BASE_URL}/api/user/updateDetails`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
  
      if (response.data.success) {
        const updatedUserData = {
          ...userData,
          ...response.data.userData
        };
        
        setUserData(updatedUserData);
        setFormData({
          email: updatedUserData.email,
          nickname: updatedUserData.nickname,
          birthyear: updatedUserData.birthyear,
          gender: updatedUserData.gender,
          country: updatedUserData.country
        });
        
        toast.success('Profile updated successfully!');
        setIsEditingDetails(false);
        setError(null);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      email: userData?.email || '',
      nickname: userData?.nickname || '',
      birthyear: userData?.birthyear || '',
      gender: userData?.gender || 'Prefer not to say',
      country: userData?.country || '',
    });
    setIsEditingDetails(false);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="relative mb-4 group">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl font-bold overflow-hidden">
            {userData?.photo ? (
              <img src={userData.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              userData?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <button className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <h2 className="text-xl font-bold">{userData?.name || 'User'}</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium text-lg flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h3>
          {isEditingDetails ? (
            <div className="space-x-2">
              <button 
                onClick={handleCancel}
                className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveDetails}
                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditingDetails(true)}
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Update Details
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Email</label>
            {isEditingDetails ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                disabled
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                {userData?.email || 'Not provided'}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Nickname</label>
            {isEditingDetails ? (
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                maxLength={30}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                {userData?.nickname || 'Not set'}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Birthyear</label>
            {isEditingDetails ? (
              <select
                name="birthyear"
                value={formData.birthyear}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Year</option>
                {birthYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                {userData?.birthyear || 'Not specified'}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Gender</label>
            {isEditingDetails ? (
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Prefer not to say">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                {userData?.gender || 'Not specified'}
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-500 mb-1">Country</label>
            {isEditingDetails ? (
              <div className="relative" ref={countryDropdownDetailsRef}>
                <input
                  ref={countryInputDetailsRef}
                  type="text"
                  value={formData.country}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      country: e.target.value
                    }));
                    setCountrySearchDetails(e.target.value);
                    setShowCountryDropdownDetails(true);
                  }}
                  onKeyDown={handleKeyDownDetails}
                  onFocus={() => {
                    setShowCountryDropdownDetails(true);
                    setHighlightedIndexDetails(-1);
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Search country..."
                />
                {showCountryDropdownDetails && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="sticky top-0 bg-white p-2 border-b">
                      <input
                        type="text"
                        value={countrySearchDetails}
                        onChange={(e) => setCountrySearchDetails(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        placeholder="Type to search..."
                        autoFocus
                      />
                    </div>
                    {filteredCountriesDetails.length > 0 ? (
                      filteredCountriesDetails.map((country, index) => (
                        <div
                          key={country}
                          className={`px-4 py-2 cursor-pointer ${
                            index === highlightedIndexDetails 
                              ? 'bg-indigo-100 text-indigo-800' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleCountrySelectDetails(country)}
                          onMouseEnter={() => setHighlightedIndexDetails(index)}
                        >
                          {country}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">No countries found</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                {userData?.country || 'Not specified'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsSection;