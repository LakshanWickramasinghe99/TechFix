import React, { useState } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  AlertTriangle,
  BarChart3,
  Download
} from "lucide-react";

const Analytics = () => {
  const [activeRange, setActiveRange] = useState("30d");

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
          <title>Inventory Analytics Report</title>
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
          </style>
        </head>
        <body>
          <h1>Inventory Analytics Report</h1>
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
          <h1 className="text-2xl font-bold text-gray-800">Inventory Analytics</h1>
          <p className="text-gray-600">Detailed inventory insights and product performance</p>
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

        {/* Low Stock Alerts - Kept in UI but not in PDF */}
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
          <div className="chart-placeholder">
            <p className="text-gray-600">Sales Chart Placeholder</p>
            <p className="text-sm text-gray-500">Actual chart data would be displayed here in a full implementation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;