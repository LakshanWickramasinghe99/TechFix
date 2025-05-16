import { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Users, 
  ShoppingCart, 
  BarChart, 
  HelpCircle, 
  LogOut,
  Menu,
  X
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Navigation link component
  const NavLink = ({ icon, label, href = "#" }) => (
    <a href={href} className="flex items-center p-3 hover:bg-blue-100 rounded-lg transition-colors duration-200 group">
      {icon}
      <span className="font-medium">{label}</span>
    </a>
  );

  return (
    <>
      {/* Mobile menu toggle - only visible on small screens */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-blue-50 rounded-lg shadow-md md:hidden flex items-center justify-center"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <Menu size={20} className="text-blue-600" /> : <X size={20} className="text-blue-600" />}
      </button>
      
      {/* Sidebar - fixed position */}
      <div className={`fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 ease-in-out ${collapsed ? "-translate-x-full" : "translate-x-0"} md:translate-x-0`}>
        <div className="w-64 h-screen bg-blue-50 text-gray-700 flex flex-col shadow-md">
          {/* Header section */}
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-bold text-blue-800 mb-1">Admin Dashboard</h2>
            <p className="text-gray-500 text-sm">Welcome back, Admin</p>
          </div>

          {/* Main navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="mb-6">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 pl-2 font-semibold">Main Navigation</p>
              <div className="space-y-1">
               
                <NavLink 
                  icon={<Package className="w-5 h-5 mr-3 text-indigo-600" />}
                  label="Products"
                  href="/admin/products"
                />
                <NavLink 
                  icon={<Users className="w-5 h-5 mr-3 text-teal-600" />}
                  label="Users"
                  href="/admin/adminviewusers"
                />
                <NavLink 
                  icon={<ShoppingCart className="w-5 h-5 mr-3 text-green-600" />}
                  label="Orders"
                  href="/admin/orders"
                />
                <NavLink 
                  icon={<BarChart className="w-5 h-5 mr-3 text-amber-600" />}
                  label="Analytics"
                  href="/admin/analytics"
                />
              </div>
            </div>

            
          </nav>

          {/* Footer section */}
          <div className="p-4 border-t border-blue-100">
            <a href="/logout" className="flex items-center p-3 bg-white hover:bg-red-50 text-red-600 rounded-lg transition-colors duration-200 justify-center shadow-sm">
              <LogOut className="w-5 h-5 mr-2" /> 
              <span className="font-medium">Logout</span>
            </a>
          </div>
        </div>
      </div>
      
      
    </>
  );
};

export default Sidebar;