import React from "react";
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    { id: 1, title: "Total Revenue", value: "$24,532", change: "+12.5%", trend: "up", icon: DollarSign, color: "blue" },
    { id: 2, title: "New Customers", value: "1,234", change: "+18.2%", trend: "up", icon: Users, color: "green" },
    { id: 3, title: "Total Orders", value: "2,345", change: "+7.1%", trend: "up", icon: ShoppingBag, color: "purple" },
    { id: 4, title: "Conversion Rate", value: "3.2%", change: "-0.8%", trend: "down", icon: TrendingUp, color: "yellow" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow p-6 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</p>
              </div>
              <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {stat.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {stat.change} since last week
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;