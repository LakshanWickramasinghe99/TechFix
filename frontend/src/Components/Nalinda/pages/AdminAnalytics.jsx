import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  AlertTriangle, 
  Download, 
  RefreshCw, 
  Users, 
  ShoppingBag, 
  Package, 
  UserPlus,
  FileText, 
  Settings,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

// Custom hook for API data fetching with loading and error states
const useApiData = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error('API fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Date formatting utility
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

// Reusable stat card component with icon
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white shadow-sm p-6 rounded-lg transition-all hover:shadow-md border border-gray-100">
    <div className="flex items-center mb-3">
      <div className="p-2 bg-gray-50 rounded-md mr-3">
        <Icon size={20} className="text-gray-600" />
      </div>
      <h2 className="text-lg font-medium text-gray-700">{title}</h2>
    </div>
    <p className="text-2xl font-semibold text-gray-800">{value}</p>
  </div>
);

// Enhanced table component with sorting capability
const ProductTable = ({ products, title }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  
  const sortedProducts = React.useMemo(() => {
    if (!sortConfig.key) return products;
    
    return [...products].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [products, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? 
      <ChevronUp size={16} className="inline ml-1" /> : 
      <ChevronDown size={16} className="inline ml-1" />;
  };

  // Function to get status badge style
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'Low':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Good':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
        <Package size={20} className="mr-2 text-gray-600" />
        {title}
      </h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer"
                onClick={() => requestSort('title')}
              >
                <div className="flex items-center">
                  Title
                  {renderSortIcon('title')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer"
                onClick={() => requestSort('price')}
              >
                <div className="flex items-center">
                  Price
                  {renderSortIcon('price')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer"
                onClick={() => requestSort('stock')}
              >
                <div className="flex items-center">
                  Stock
                  {renderSortIcon('stock')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer"
                onClick={() => requestSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {renderSortIcon('status')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product, index) => (
              <tr key={index} className={`border-t border-gray-100 hover:bg-gray-50`}>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{product.title}</td>
                <td className="px-4 py-3 text-sm text-gray-700">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{product.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}
                  >
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// PDF Settings Modal Component
const PdfSettingsModal = ({ isOpen, onClose, onExport }) => {
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [quality, setQuality] = useState('high');
  const [includeHeader, setIncludeHeader] = useState(true);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center mb-4">
          <FileText size={20} className="text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">PDF Export Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
            <select 
              value={pageSize} 
              onChange={(e) => setPageSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
              <option value="legal">Legal</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
            <select 
              value={orientation} 
              onChange={(e) => setOrientation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
            <select 
              value={quality} 
              onChange={(e) => setQuality(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="includeHeader" 
              checked={includeHeader}
              onChange={(e) => setIncludeHeader(e.target.checked)}
              className="w-4 h-4 text-gray-600 rounded focus:ring-gray-500"
            />
            <label htmlFor="includeHeader" className="ml-2 text-sm font-medium text-gray-700">Include page header</label>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button 
            onClick={() => onExport({ pageSize, orientation, quality, includeHeader })}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-800 flex items-center"
          >
            <Download size={16} className="mr-2" />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// Error state component
const ErrorState = ({ message, onRetry }) => (
  <div className="p-6 text-center bg-gray-50 rounded-lg shadow-sm border border-gray-200">
    <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
    <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
    <p className="text-gray-600 mb-4">{message}</p>
    <button 
      onClick={onRetry}
      className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center mx-auto"
      aria-label="Retry loading data"
    >
      <RefreshCw className="inline mr-2" size={16} />
      Retry
    </button>
  </div>
);

// Loading state component
const LoadingState = () => (
  <div className="p-6 text-center" aria-live="polite" aria-busy="true">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto mb-4"></div>
    <p className="text-lg text-gray-700">Loading analytics data...</p>
  </div>
);

const AdminAnalytics = () => {
  const { data: analytics, loading, error, refetch } = useApiData('http://localhost:5000/api/admin/analytics');
  const [currentDate] = useState(new Date());
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const reportRef = useRef();

  // Function to generate PDF with settings
  const downloadPDF = async (settings) => {
    try {
      const { jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      
      const element = reportRef.current;
      const scaleOptions = {
        low: 1,
        medium: 2,
        high: 3
      };
      
      const canvas = await html2canvas(element, {
        scale: scaleOptions[settings.quality] || 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#f8fafc' // Match the background color
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF(settings.orientation, 'mm', settings.pageSize);
      
      // Calculate dimensions based on orientation
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = settings.includeHeader ? 20 : 0;
      
      // Add header if requested
      if (settings.includeHeader) {
        pdf.setFontSize(16);
        pdf.setTextColor(50, 50, 50);
        pdf.text('Admin Analytics Report', pdfWidth/2, 10, { align: 'center' });
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated on ${formatDate(currentDate)}`, pdfWidth/2, 16, { align: 'center' });
      }
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`admin-analytics-${formatDate(currentDate)}.pdf`);
      
      setIsPdfModalOpen(false);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Analytics data as of {formatDate(currentDate)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refetch}
            className="bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center shadow-sm border border-gray-200"
            aria-label="Refresh data"
          >
            <RefreshCw className="mr-2" size={16} />
            Refresh
          </button>
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center shadow-sm"
            aria-label="Configure PDF export"
          >
            <FileText className="mr-2" size={16} />
            Export PDF
          </button>
        </div>
      </header>

      <div ref={reportRef} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Users" 
            value={analytics.totalUsers.toLocaleString()} 
            icon={Users} 
          />
          <StatCard 
            title="Total Orders" 
            value={analytics.totalOrders.toLocaleString()} 
            icon={ShoppingBag} 
          />
          <StatCard 
            title="Total Products" 
            value={analytics.totalProducts.toLocaleString()} 
            icon={Package} 
          />
          <StatCard 
            title="New Customers" 
            value={analytics.newUserCount.toLocaleString()} 
            icon={UserPlus}
          />
        </div>

        <ProductTable products={analytics.stockDetails} title="Product Stock Status" />
      </div>
      
      <PdfSettingsModal 
        isOpen={isPdfModalOpen} 
        onClose={() => setIsPdfModalOpen(false)}
        onExport={downloadPDF}
      />
    </div>
  );
};

export default AdminAnalytics;