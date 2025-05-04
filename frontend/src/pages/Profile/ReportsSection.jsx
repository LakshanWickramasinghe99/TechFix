import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReportsSection = () => {
  const [reportType, setReportType] = useState('purchase');
  const [reportFormat, setReportFormat] = useState('pdf');

  const handleGenerateReport = () => {
    console.log(`Generating ${reportType} report in ${reportFormat} format`);
    alert(`Your ${reportType} report in ${reportFormat} format is being generated!`);
  };

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
};

export default ReportsSection;
