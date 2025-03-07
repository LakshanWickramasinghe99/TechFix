import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

function QuickLinks() {
  return (
    <div className="bg-white shadow-md rounded p-4 mb-4">
      <h2 className="text-xl font-bold">Quick Links</h2>
      <ul>
        <li><Link to="/quotation" className="text-blue-500">View Quotations</Link></li>
        <li><Link to="/techFixProducts" className="text-blue-500">Manage Products</Link></li>
        <li><Link to="/quotation" className="text-blue-500">Request Quotation</Link></li>
      </ul>
    </div>
  );
}

export default QuickLinks;
