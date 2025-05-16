import Sidebar from "./sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Bell, User } from "lucide-react";
import { useState } from "react";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm z-10 sticky top-0">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Mobile Menu Button */}
            <button
              className="text-gray-600 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Empty space for better layout balance */}
            <div className="lg:ml-0 ml-4 flex-1">
              {/* Title removed as requested */}
            </div>

            {/* Header Right */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>

              <div className="relative">
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  <span className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium mr-2">
                    A
                  </span>
                  <span className="hidden md:block font-medium">Admin</span>
                  <svg className="ml-1 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Breadcrumb with improved design and added spacing */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-3">
              <li>
                <a href="/admin" className="text-indigo-600 hover:text-indigo-800 font-medium">Admin</a>
              </li>
              {pathSegments.slice(1).map((segment, index) => {
                const url = '/' + pathSegments.slice(0, index + 2).join('/');
                const label = decodeURIComponent(segment)
                  .replace(/-/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase());
                return (
                  <li className="flex items-center" key={index}>
                    <svg className="h-4 w-4 text-gray-400 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <a href={url} className="text-gray-500 hover:text-indigo-600 capitalize">{label}</a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Main Page Content with improved padding and design */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto py-4">
            <Outlet />
          </div>
        </main>

        {/* Footer with improved design and spacing */}
        <footer className="bg-white border-t border-gray-200 p-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 Your Company. All rights reserved.</p>
            <p className="mt-2">
              <a href="#" className="text-indigo-600 hover:underline mx-3">Privacy Policy</a>
              <a href="#" className="text-indigo-600 hover:underline mx-3">Terms of Service</a>
              <a href="#" className="text-indigo-600 hover:underline mx-3">Contact</a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;