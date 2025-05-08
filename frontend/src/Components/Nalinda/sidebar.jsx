import { Link } from "react-router-dom";
import { LayoutDashboard, Package, Settings, Users, ShoppingCart, BarChart, HelpCircle, LogOut } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-lg">
      {/* Header section */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-1">Admin Panel</h2>
        <p className="text-gray-400 text-xs text-center">Welcome back, Admin</p>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 pl-2">Main</p>
          <div className="space-y-1">
          <Link to="/admin/products" className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200 group">
              <Package className="w-5 h-5 mr-3 text-yellow-400 group-hover:text-yellow-300" /> 
              <span className="font-medium">Products</span>
            </Link>
            <Link to="/admin/adminviewusers" className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200 group">
              <Users className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-300" /> 
              <span className="font-medium">Users</span>
            </Link>
            <Link to="/admin/orders" className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200 group">
              <ShoppingCart className="w-5 h-5 mr-3 text-purple-400 group-hover:text-purple-300" /> 
              <span className="font-medium">Orders</span>
            </Link>
            <Link to="/admin/analytics" className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200 group">
              <BarChart className="w-5 h-5 mr-3 text-green-400 group-hover:text-green-300" /> 
              <span className="font-medium">Analytics</span>
            </Link>
            
          </div>
        </div>

      </nav>

      {/* Footer section */}
      <div className="p-4 border-t border-gray-700">
        <Link to="/logout" className="flex items-center p-3 hover:bg-red-600 bg-gray-700 rounded-lg transition-colors duration-200 justify-center">
          <LogOut className="w-5 h-5 mr-2" /> 
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;