import React from 'react';
import logo from '../../assets/logo.png'; // Import the logo image
import Header from './Header'; // Import the Header component


function HomePage() {
  return (
    <div>
      {/* <header className="flex items-center justify-center bg-[#003092] h-1/6">
        <img src={logo} alt="Logo" className="h-32" />
      </header> */}
      <Header />
      <div className="flex items-center justify-center h-5/6 p-5">
        <h1 className="text-4xl font-bold text-[#003092]">Welcome to TechFix Dashboard</h1>
        </div>
          <div className="grid grid-cols-3 gap-6 w-3/4 mx-auto my-10">
            <button className="bg-blue-500 text-white py-2 px-4 rounded">Add Supplier</button>
            <button className="bg-blue-500 text-white py-2 px-4 rounded">Request Quotation</button>
            <button className="bg-blue-500 text-white py-2 px-4 rounded">Page 3</button>
            <button className="bg-blue-500 text-white py-2 px-4 rounded">Page 4</button>
            <button className="bg-blue-500 text-white py-2 px-4 rounded">Page 5</button>
            <button className="bg-blue-500 text-white py-2 px-4 rounded">Page 6</button>
          </div>
        
      </div>
    
  );
}


export default HomePage;
