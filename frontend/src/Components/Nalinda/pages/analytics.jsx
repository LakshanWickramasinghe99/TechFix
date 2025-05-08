import React, { useState } from "react";
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  AlertTriangle,
  BarChart3,
  Download
} from "lucide-react";

const Analytics = () => {
  const [activeRange, setActiveRange] = useState("30d");

  // Dashboard stats
  const stats = [
    { id: 1, title: "Total Revenue", value: "$24,532", change: "+12.5%", trend: "up", icon: DollarSign, color: "blue" },
    { id: 2, title: "New Customers", value: "1,234", change: "+18.2%", trend: "up", icon: Users, color: "green" },
    { id: 3, title: "Total Orders", value: "2,345", change: "+7.1%", trend: "up", icon: ShoppingBag, color: "purple" },
    { id: 4, title: "Conversion Rate", value: "3.2%", change: "-0.8%", trend: "down", icon: TrendingUp, color: "yellow" },
  ];

  // Top selling products data
  const topProducts = [
    { id: 1, name: "Wireless Headphones", sales: 1324, revenue: "$105,920", stock: 42, status: "good" },
    { id: 2, name: "Smart TV 55\"", sales: 942, revenue: "$659,400", stock: 15, status: "low" },
    { id: 3, name: "DSLR Camera", sales: 835, revenue: "$500,100", stock: 8, status: "critical" },
    { id: 4, name: "Smartphone Pro", sales: 712, revenue: "$640,800", stock: 25, status: "good" },
    { id: 5, name: "Coffee Grinder", sales: 694, revenue: "$48,580", stock: 10, status: "low" },
  ];

  // Low stock alerts
  const lowStockItems = topProducts.filter(product => 
    product.status === "low" || product.status === "critical"
  );

  // PDF Export Function
  const exportToPDF = () => {
    // Create a printable version of the table and charts
    const printContents = document.getElementById('printable-content').innerHTML;
    const originalContents = document.body.innerHTML;

    // Replace body with table contents
    document.body.innerHTML = `
      <html>
        <head>
          <title>Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .status-good { color: green; }
            .status-low { color: orange; }
            .status-critical { color: red; }
            .chart-placeholder { 
              border: 1px solid #ddd; 
              padding: 20px; 
              text-align: center; 
              background-color: #f9f9f9; 
              margin-top: 20px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-bottom: 20px;
            }
            .stat-card {
              border: 1px solid #ddd;
              padding: 15px;
              border-radius: 8px;
            }
            .stat-title {
              font-size: 14px;
              color: #666;
              margin-bottom: 5px;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .stat-change {
              font-size: 14px;
              color: green;
            }
            .stat-change.negative {
              color: red;
            }
          </style>
        </head>
        <body>
          <h1>Analytics Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          ${printContents}
        </body>
      </html>
    `;

    // Trigger print dialog
    window.print();

    // Restore original body content
    document.body.innerHTML = originalContents;

    // Reload to restore event listeners and React functionality
    window.location.reload();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600">Business performance and inventory insights</p>
        </div>
        <button 
          onClick={exportToPDF}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          <Download className="w-5 h-5 mr-2" />
          Export PDF
        </button>
      </div>

      <div id="printable-content">
        {/* Stats Cards from Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Top Selling Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.revenue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${product.status === 'good' ? 'bg-green-100 text-green-800' : ''}
                        ${product.status === 'low' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${product.status === 'critical' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {product.status === 'good' ? 'Good' : 
                         product.status === 'low' ? 'Low Stock' : 
                         'Critical Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-100 flex items-center">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-800">Low Stock Alerts</h2>
          </div>
          <div className="p-6">
            {lowStockItems.length > 0 ? (
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-yellow-50 p-4 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Current Stock: {item.stock}</p>
                    </div>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600">
                      Reorder
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No low stock items</p>
            )}
          </div>
        </div>

        {/* Sales Overview Chart */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Sales Overview</h2>
          </div>
          <div className="p-6 flex justify-center">
            <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Sales Chart Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;