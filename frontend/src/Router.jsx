import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Techfix/HomePage';
import Suppliers from './components/Techfix/Suppliers';
import Quotation from './components/Techfix/RequestQuotation';
import Product from './components/Techfix/Products';
import TechFixProducts from './components/Techfix/TechFixProducts';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/quotation" element={<Quotation />} />
        <Route path="/product" element={<Product />} />
        <Route path="/techFixProducts" element={<TechFixProducts />} />

        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
