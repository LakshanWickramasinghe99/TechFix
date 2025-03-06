import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Techfix/HomePage';
import Suppliers from './components/Techfix/Suppliers';
import Home from './components/Supplier/Home';
import Order from './components/Supplier/Order';
import Products from './components/Supplier/Products';
import Quotation from './components/Supplier/Quotation';
import "../src/index.css";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/fg" element={<HomePage />} />
        <Route path="/suppliers" element={<Suppliers />}>
        <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Order />} />
          <Route path="quotations" element={<Quotation />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
