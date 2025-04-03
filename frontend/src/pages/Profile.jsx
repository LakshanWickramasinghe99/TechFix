import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

// List of countries including Sri Lanka
const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", 
    "Antigua and Barbuda", "Argentina", "Armenia", "Australia", 
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", 
    "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", 
    "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", 
    "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", 
    "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", 
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", 
    "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", 
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", 
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", 
    "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", 
    "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", 
    "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", 
    "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", 
    "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", 
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", 
    "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", 
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", 
    "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", 
    "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", 
    "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", 
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", 
    "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", 
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
    "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", 
    "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", 
    "Solomon Islands", "Somalia", "South Africa", "South Korea", 
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", 
    "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", 
    "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", 
    "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
    "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", 
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const Profile = () => {
    const navigate = useNavigate();
    const { userData, setUserData } = useContext(AppContext);
    
    // State management
    const [activeTab, setActiveTab] = useState('details');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [reportType, setReportType] = useState('purchase');
    const [reportFormat, setReportFormat] = useState('pdf');
    
    // Country search states for both sections
    const [countrySearch, setCountrySearch] = useState('');
    const [countrySearchDetails, setCountrySearchDetails] = useState('');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showCountryDropdownDetails, setShowCountryDropdownDetails] = useState(false);
    const [filteredCountries, setFilteredCountries] = useState(countries);
    const [filteredCountriesDetails, setFilteredCountriesDetails] = useState(countries);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [highlightedIndexDetails, setHighlightedIndexDetails] = useState(-1);
    
    const countryDropdownRef = useRef(null);
    const countryDropdownDetailsRef = useRef(null);
    const countryInputRef = useRef(null);
    const countryInputDetailsRef = useRef(null);

    // Generate birth years (from current year back to 1900)
    const currentYear = new Date().getFullYear();
    const birthYears = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

    const [formData, setFormData] = useState({
        email: userData?.email || '',
        nickname: userData?.nickname || '',
        birthday: userData?.birthday || '',
        gender: userData?.gender || '',
        country: userData?.country || '',
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

    // Mock addresses - replace with real data from your backend
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            type: 'Home',
            streetNumber: '123',
            streetName: 'Main Street',
            city: 'Colombo',
            district: 'Colombo',
            province: 'Western',
            postalCode: '00100',
            country: 'Sri Lanka',
            isPrimary: true
        },
        {
            id: 2,
            type: 'Work',
            streetNumber: '456',
            streetName: 'Business Avenue',
            city: 'Kandy',
            district: 'Kandy',
            province: 'Central',
            postalCode: '20000',
            country: 'Sri Lanka',
            isPrimary: false
        }
    ]);
    
    const [purchases, setPurchases] = useState([
        {
            id: 1,
            date: '2024-10-15',
            item: 'HP Laptop',
            quantity: 1,
            amount: 215000.00
        },
        {
            id: 2,
            date: '2024-09-28',
            item: 'SanDisk pendrive',
            quantity: 3,
            amount: 6500.00
        },
        {
            id: 3,
            date: '2024-08-10',
            item: 'Iphone 15 pro',
            quantity: 1,
            amount: 350000.00
        }
    ]);

    // Click outside handlers
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
                setShowCountryDropdown(false);
            }
            if (countryDropdownDetailsRef.current && !countryDropdownDetailsRef.current.contains(event.target)) {
                setShowCountryDropdownDetails(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Country filtering effects
    useEffect(() => {
        setFilteredCountries(
            countrySearch 
                ? countries.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()))
                : countries
        );
    }, [countrySearch]);

    useEffect(() => {
        setFilteredCountriesDetails(
            countrySearchDetails 
                ? countries.filter(c => c.toLowerCase().includes(countrySearchDetails.toLowerCase()))
                : countries
        );
    }, [countrySearchDetails]);

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

    // Handle keyboard navigation for details country
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

    // Country selection handlers
    const handleCountrySelect = (country) => {
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, country }
        }));
        setCountrySearch('');
        setShowCountryDropdown(false);
        setHighlightedIndex(-1);
    };

    const handleCountrySelectDetails = (country) => {
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

    const handleSaveDetails = () => {
        const updatedUserData = {
            ...userData,
            email: formData.email,
            nickname: formData.nickname,
            birthyear: formData.birthyear,
            gender: formData.gender,
            country: formData.country
        };
        
        setUserData(updatedUserData);
        setIsEditingDetails(false);
        console.log('Updated details:', updatedUserData);
    };

    const handleSaveAddress = () => {
        if (isAddingAddress) {
            const newAddress = {
                id: addresses.length + 1,
                ...formData.address,
                isPrimary: addresses.length === 0
            };
            setAddresses([...addresses, newAddress]);
            setIsAddingAddress(false);
        } else {
            const updatedAddresses = addresses.map(addr => 
                addr.isPrimary ? {...formData.address, id: addr.id, isPrimary: true} : addr
            );
            setAddresses(updatedAddresses);
            setIsEditingAddress(false);
        }
    };

    const handleDeleteAddress = (id) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
    };

    const handleSetPrimary = (id) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isPrimary: addr.id === id
        })));
    };

    const handleGenerateReport = () => {
        console.log(`Generating ${reportType} report in ${reportFormat} format`);
        alert(`Your ${reportType} report in ${reportFormat} format is being generated!`);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
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
                                            onClick={() => setIsEditingDetails(false)}
                                            className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleSaveDetails}
                                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                        >
                                            Save
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
                                            {userData?.birthday || 'Not specified'}
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
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
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
            case 'address':
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
                                            ...formData,
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
                                        <div key={address.id} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center">
                                                        <h3 className="font-medium">{address.type} Address</h3>
                                                        {address.isPrimary && (
                                                            <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Primary</span>
                                                        )}
                                                    </div>
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
                                                                ...formData,
                                                                address: {
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
                                                    {!address.isPrimary && (
                                                        <>
                                                            <span className="text-gray-300">|</span>
                                                            <button 
                                                                onClick={() => handleSetPrimary(address.id)}
                                                                className="text-indigo-600 hover:text-indigo-800"
                                                            >
                                                                Set Primary
                                                            </button>
                                                            <span className="text-gray-300">|</span>
                                                            <button 
                                                                onClick={() => handleDeleteAddress(address.id)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
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
            case 'purchases':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="font-medium text-lg mb-6 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            My Purchases
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {purchases.map((purchase) => (
                                        <tr key={purchase.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {purchase.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {purchase.item}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {purchase.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {purchase.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'reports':
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="font-medium text-lg mb-6 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Generate Reports
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                                    <select
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="purchase">Purchase Report</option>
                                        <option value="user">User Details Report</option>
                                        <option value="activity">Activity Report</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                                    <select
                                        value={reportFormat}
                                        onChange={(e) => setReportFormat(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="pdf">PDF</option>
                                        <option value="csv">CSV</option>
                                        <option value="excel">Excel</option>
                                    </select>
                                </div>
                            </div>
                            <button 
                                onClick={handleGenerateReport}
                                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Generate Report
                            </button>
                        </div>
                    </div>
                );
            case 'delete':
                return (
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
                );
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
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                }}
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
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                            {userData?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{userData?.name || 'User'}</p>
                                        <p className="text-sm text-gray-500 truncate">{userData?.email || 'user@example.com'}</p>
                                    </div>
                                </div>
                            </div>
                            <nav className="p-4 space-y-1">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'details' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <svg className={`w-5 h-5 mr-3 ${activeTab === 'details' ? 'text-indigo-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    My Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('address')}
                                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'address' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <svg className={`w-5 h-5 mr-3 ${activeTab === 'address' ? 'text-indigo-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Address
                                </button>
                                <button
                                    onClick={() => setActiveTab('purchases')}
                                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'purchases' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <svg className={`w-5 h-5 mr-3 ${activeTab === 'purchases' ? 'text-indigo-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    My Purchases
                                </button>
                                <button
                                    onClick={() => setActiveTab('reports')}
                                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'reports' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <svg className={`w-5 h-5 mr-3 ${activeTab === 'reports' ? 'text-indigo-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Reports
                                </button>
                                <button
                                    onClick={() => setActiveTab('delete')}
                                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'delete' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <svg className={`w-5 h-5 mr-3 ${activeTab === 'delete' ? 'text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Account
                                </button>
                            </nav>
                        </div>
                    </div>

                    <div className="flex-1">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;