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
  ChevronDown,
  FilePlus
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

// Improved PDF Settings Modal Component
const PdfSettingsModal = ({ isOpen, onClose, onExport }) => {
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [quality, setQuality] = useState('high');
  const [includeHeader, setIncludeHeader] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  if (!isOpen) return null;
  
  const handleExport = () => {
    setIsGenerating(true);
    // We use setTimeout to allow the UI to update before starting the potentially heavy operation
    setTimeout(() => {
      onExport({ pageSize, orientation, quality, includeHeader })
        .finally(() => setIsGenerating(false));
    }, 100);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
          <div className="flex items-center">
            <FilePlus size={22} className="text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Export Report to PDF</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
            <div className="flex gap-3">
              <button
                className={`flex-1 py-2 rounded-md border ${pageSize === 'a4' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setPageSize('a4')}
              >
                A4
              </button>
              <button
                className={`flex-1 py-2 rounded-md border ${pageSize === 'letter' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setPageSize('letter')}
              >
                Letter
              </button>
              <button
                className={`flex-1 py-2 rounded-md border ${pageSize === 'legal' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setPageSize('legal')}
              >
                Legal
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
            <div className="flex gap-3">
              <button
                className={`flex-1 py-2 rounded-md border ${orientation === 'portrait' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setOrientation('portrait')}
              >
                Portrait
              </button>
              <button
                className={`flex-1 py-2 rounded-md border ${orientation === 'landscape' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setOrientation('landscape')}
              >
                Landscape
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
            <div className="flex gap-3">
              <button
                className={`flex-1 py-2 rounded-md border ${quality === 'low' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setQuality('low')}
              >
                Low
              </button>
              <button
                className={`flex-1 py-2 rounded-md border ${quality === 'medium' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setQuality('medium')}
              >
                Medium
              </button>
              <button
                className={`flex-1 py-2 rounded-md border ${quality === 'high' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setQuality('high')}
              >
                High
              </button>
            </div>
          </div>
          
          <div className="flex items-center bg-gray-50 p-3 rounded-md">
            <input 
              type="checkbox" 
              id="includeHeader" 
              checked={includeHeader}
              onChange={(e) => setIncludeHeader(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="includeHeader" className="ml-2 text-sm font-medium text-gray-700">
              Include report header with date
            </label>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleExport}
            disabled={isGenerating}
            className={`px-6 py-2 text-sm font-medium text-white rounded-md flex items-center transition-colors
              ${isGenerating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Download size={16} className="mr-2" />
                Download PDF
              </>
            )}
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

// Improved PDF Generation Feedback Toast
const PdfGenerationToast = ({ visible, message, status }) => {
  if (!visible) return null;
  
  const statusStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    progress: "bg-blue-500"
  };
  
  return (
    <div className={`fixed bottom-4 right-4 ${statusStyles[status] || "bg-gray-700"} text-white py-3 px-4 rounded-md shadow-lg flex items-center z-50 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {status === "progress" && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>}
      {status === "success" && <Download size={16} className="mr-3" />}
      {status === "error" && <AlertTriangle size={16} className="mr-3" />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

const AdminAnalytics = () => {
  const { data: analytics, loading, error, refetch } = useApiData('http://localhost:5000/api/admin/analytics');
  const [currentDate] = useState(new Date());
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfToast, setPdfToast] = useState({
    visible: false,
    message: "",
    status: "success" // 'success', 'error', 'progress'
  });
  const reportRef = useRef();

  // Helper to show and auto-hide toast notifications
  const showToast = (message, status) => {
    setPdfToast({
      visible: true,
      message,
      status
    });
    
    // Auto-hide toast after 3 seconds for success/error
    if (status !== 'progress') {
      setTimeout(() => {
        setPdfToast(prev => ({...prev, visible: false}));
      }, 3000);
    }
  };

  // Improved PDF generation with better error handling
  const downloadPDF = async (settings) => {
    showToast("Preparing PDF for download...", "progress");
    
    try {
      // Dynamically import PDF libraries to reduce initial load time
      const [jsPdfModule, html2canvasModule] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);
      
      const { jsPDF } = jsPdfModule;
      const html2canvas = html2canvasModule.default;
      
      const element = reportRef.current;
      if (!element) {
        throw new Error("Could not find report content to export");
      }
      
      // Quality scaling options
      const scaleOptions = {
        low: 1.5,
        medium: 2.5,
        high: 3.5
      };
      
      // Pre-processing notification
      showToast("Converting dashboard to image...", "progress");
      
      // Enhanced rendering quality and options
      const canvas = await html2canvas(element, {
        scale: scaleOptions[settings.quality] || 2.5,
        logging: false,
        useCORS: true,
        backgroundColor: '#f8fafc', // Match the background color
        allowTaint: true,
        removeContainer: true,
        imageTimeout: 15000 // Increased timeout for large reports
      });
      
      showToast("Generating PDF file...", "progress");
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF(settings.orientation, 'mm', settings.pageSize);
      
      // Calculate dimensions based on orientation
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      // Center image horizontally
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      // Add professional header if requested
      let imgY = 0;
      if (settings.includeHeader) {
        imgY = 25; // Make room for header
        
        // Add header with logo placeholder
        pdf.setFillColor(245, 247, 250);
        pdf.rect(0, 0, pdfWidth, 20, 'F');
        
        // Title and date
        pdf.setFontSize(16);
        pdf.setTextColor(50, 50, 50);
        pdf.text('Admin Analytics Report', pdfWidth/2, 10, { align: 'center' });
        
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated on ${formatDate(currentDate)}`, pdfWidth/2, 16, { align: 'center' });
        
        // Add a subtle separator line
        pdf.setDrawColor(220, 220, 220);
        pdf.line(10, 20, pdfWidth - 10, 20);
      }

      // Add page footer
      const addFooter = () => {
        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(150, 150, 150);
          pdf.text(`Page ${i} of ${pageCount}`, pdfWidth/2, pdfHeight - 5, { align: 'center' });
        }
      };
      
      // Add image with calculated dimensions
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Add footer
      addFooter();
      
      // Set appropriate filename with date
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `admin-analytics-report-${timestamp}.pdf`;
      
      // Save PDF file
      pdf.save(filename);
      
      // Show success message
      showToast("PDF successfully downloaded!", "success");
      setIsPdfModalOpen(false);
      
    } catch (err) {
      console.error('PDF generation failed:', err);
      showToast("Failed to generate PDF. Please try again.", "error");
    }
  };

  // Clear toast when component unmounts
  useEffect(() => {
    return () => {
      if (pdfToast.visible) {
        setPdfToast({visible: false, message: "", status: "success"});
      }
    };
  }, []);

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
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center shadow-sm font-medium"
            aria-label="Export dashboard as PDF"
          >
            <Download className="mr-2" size={16} />
            Download PDF
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
      
      {/* Improved PDF settings modal */}
      <PdfSettingsModal 
        isOpen={isPdfModalOpen} 
        onClose={() => setIsPdfModalOpen(false)}
        onExport={downloadPDF}
      />
      
      {/* Toast notification for PDF generation status */}
      <PdfGenerationToast 
        visible={pdfToast.visible}
        message={pdfToast.message}
        status={pdfToast.status}
      />
    </div>
  );
};

export default AdminAnalytics;