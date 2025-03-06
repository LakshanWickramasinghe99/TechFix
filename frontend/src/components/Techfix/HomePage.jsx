import React from 'react';
import logo from '../../assets/logo.png'; // Import the logo image
import Header from './Header'; // Import the Header component


function HomePage() {
  return (
    <div>
      <Header />
      <div className="flex items-center justify-center h-5/6 p-5">
        <h1 className="text-4xl font-bold text-[#003092]">Welcome to TechFix Dashboard</h1>
        </div>
          
        
      </div>
    
  );
}


export default HomePage;
