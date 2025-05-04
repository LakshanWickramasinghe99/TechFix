import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, userData }) => {
  return (
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
  );
};

export default Sidebar;