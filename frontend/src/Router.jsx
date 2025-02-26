import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Techfix/HomePage';
import Suppliers from './components/Techfix/Suppliers';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/suppliers" element={<Suppliers />} />

        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
