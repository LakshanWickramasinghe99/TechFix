import React from 'react';
import { useState } from 'react'; // Import useState for managing state
import RecentActivity from './RecentActivity'; // Import RecentActivity component
import Statistics from './Statistics'; // Import Statistics component
import QuickLinks from './QuickLinks'; // Import QuickLinks component

import logo from '../../assets/logo.png'; // Import the logo image
import Header from './Header'; // Import the Header component

function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
  <Header />
  <div className="flex flex-col items-center justify-center h-5/6 p-5">
    {/* Heading */}
    <h1 className="text-4xl font-bold text-[#003092] mb-8">
      Welcome to TechFix Dashboard
    </h1>

    {/* Statistics Section */}
    <div className="w-full max-w-6xl mb-8">
      <Statistics />
    </div>

    {/* Recent Activity Section */}
    <div className="w-full max-w-6xl mb-8">
      <RecentActivity />
    </div>

    {/* Quick Links Section */}
    <div className="w-full max-w-6xl">
      <QuickLinks />
    </div>
  </div>
</div>
  );
}

export default HomePage;