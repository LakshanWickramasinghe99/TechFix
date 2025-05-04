import React, { useState, useEffect, useRef, useMemo } from 'react';
import { countries as countryData } from 'countries-list';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const AddressSection = ({ userData, setUserData }) => {
  const { backendUrl, setUserData: setContextUserData } = useAppContext();
  
  // Generate sorted country list using useMemo to prevent recreation on every render
  const countryList = useMemo(() => 
    Object.values(countryData)
      .map(country => country.name)
      .sort(),
    []
  );
  
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState(countryList);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const countryDropdownRef = useRef(null);
  const countryInputRef = useRef(null);

  const [formData, setFormData] = useState({
    address: userData?.address || {
      type: 'Home',
      streetNumber: '',
      streetName: '',
      city: '',
      district: '',
      province: '',
      postalCode: '',
      country: ''
    }
  });

  const [addresses, setAddresses] = useState(userData?.addresses || []);

  // Country filtering effects
  useEffect(() => {
    setFilteredCountries(
      countrySearch 
        ? countryList.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()))
        : countryList
    );
  }, [countrySearch, countryList]);

  // Handle keyboard navigation for address country
  const handleKeyDown = (e) => {
    if (!showCountryDropdown) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        setShowCountryDropdown(true);
      }
      return;
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredCountries.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleCountrySelect(filteredCountries[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowCountryDropdown(false);
    }
  };

  const handleCountrySelect = (country) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, country }
    }));
    setCountrySearch('');
    setShowCountryDropdown(false);
    setHighlightedIndex(-1);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleSaveAddress = async () => {
    try {
      // Validate required fields
      const requiredFields = ['streetNumber', 'streetName', 'city', 'country'];
      const missingFields = requiredFields.filter(field => !formData.address[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }
  
      const newAddress = {
        ...formData.address,
        // Keep existing _id for edits, generate new for additions
        _id: isAddingAddress ? new Date().getTime().toString() : formData.address._id
      };
  
      const updatedAddresses = isAddingAddress
        ? [...addresses, newAddress]
        : addresses.map(addr => addr._id === newAddress._id ? newAddress : addr);
  
      const res = await axios.put(
        `${backendUrl}/api/profile/address`,
        { addresses: updatedAddresses },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (res.data.success) {
        setAddresses(updatedAddresses);
        setUserData(prev => ({ ...prev, addresses: updatedAddresses }));
        setContextUserData(prev => ({ ...prev, addresses: updatedAddresses }));
        toast.success(isAddingAddress ? "Address added successfully" : "Address updated successfully");
        setIsAddingAddress(false);
        setIsEditingAddress(false);
        
        // Reset form
        setFormData({
          address: {
            type: 'Home',
            streetNumber: '',
            streetName: '',
            city: '',
            district: '',
            province: '',
            postalCode: '',
            country: ''
          }
        });
      }
    } catch (error) {
      console.error('Save address error:', error);
      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
  
    try {
      const res = await axios.delete(
        `${backendUrl}/api/profile/address`,
        { 
          data: { addressId: id },
          withCredentials: true 
        }
      );
      
      if (res.data.success) {
        const updatedAddresses = addresses.filter(addr => addr._id !== id);
        setAddresses(updatedAddresses);
        setUserData(prev => ({ ...prev, addresses: updatedAddresses }));
        setContextUserData(prev => ({ ...prev, addresses: updatedAddresses }));
        toast.success("Address deleted successfully");
      }
    } catch (error) {
      console.error('Delete address error:', error);
      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-medium text-lg flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            My Addresses
          </h2>
          <button 
            onClick={() => {
              setIsAddingAddress(true);
              setIsEditingAddress(false);
              setFormData({
                address: {
                  type: 'Home',
                  streetNumber: '',
                  streetName: '',
                  city: '',
                  district: '',
                  province: '',
                  postalCode: '',
                  country: ''
                }
              });
            }}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Add New Address
          </button>
        </div>

        {(isEditingAddress || isAddingAddress) ? (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="font-medium mb-4">{isAddingAddress ? 'Add New Address' : 'Edit Address'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Address Type</label>
                <select
                  name="type"
                  value={formData.address.type}
                  onChange={handleAddressChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Street Number</label>
                <input
                  type="text"
                  name="streetNumber"
                  value={formData.address.streetNumber}
                  onChange={handleAddressChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Street Name</label>
                <input
                  type="text"
                  name="streetName"
                  value={formData.address.streetName}
                  onChange={handleAddressChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.address.district}
                  onChange={handleAddressChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Province</label>
                <input
                  type="text"
                  name="province"
                  value={formData.address.province}
                  onChange={handleAddressChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.address.postalCode}
                  onChange={handleAddressChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="relative" ref={countryDropdownRef}>
                <label className="block text-sm text-gray-500 mb-1">Country</label>
                <input
                  ref={countryInputRef}
                  type="text"
                  value={formData.address.country}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        country: e.target.value
                      }
                    }));
                    setCountrySearch(e.target.value);
                    setShowCountryDropdown(true);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    setShowCountryDropdown(true);
                    setHighlightedIndex(-1);
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Search country..."
                />
                {showCountryDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="sticky top-0 bg-white p-2 border-b">
                      <input
                        type="text"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        placeholder="Type to search..."
                        autoFocus
                      />
                    </div>
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country, index) => (
                        <div
                          key={country}
                          className={`px-4 py-2 cursor-pointer ${
                            index === highlightedIndex 
                              ? 'bg-indigo-100 text-indigo-800' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleCountrySelect(country)}
                          onMouseEnter={() => setHighlightedIndex(index)}
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
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setIsEditingAddress(false);
                  setIsAddingAddress(false);
                }}
                className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Save Address
              </button>
            </div>
          </div>
        ) : null}

        {addresses.length > 0 ? (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address._id} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{address.type} Address</h3>
                    <p className="text-gray-700">{address.streetNumber} {address.streetName}</p>
                    <p className="text-gray-700">{address.city}, {address.district}</p>
                    <p className="text-gray-700">{address.province} {address.postalCode}</p>
                    <p className="text-gray-700">{address.country}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setIsEditingAddress(true);
                        setIsAddingAddress(false);
                        setFormData({
                          address: {
                            _id: address._id,
                            type: address.type,
                            streetNumber: address.streetNumber,
                            streetName: address.streetName,
                            city: address.city,
                            district: address.district,
                            province: address.province,
                            postalCode: address.postalCode,
                            country: address.country
                          }
                        });
                      }}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                    <span className="text-gray-300">|</span>
                    <button 
                      onClick={() => handleDeleteAddress(address._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>You haven't added any addresses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressSection;