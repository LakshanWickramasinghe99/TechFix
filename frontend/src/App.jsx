import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Supplier/Navbar';
import Profile from './components/Supplier/Profile';
import Home from './components/Supplier/Home';
import Products from './components/Supplier/ProductList';
import ProductForm from './components/Supplier/Product'; // Create this component
import Quotations from './components/Supplier/Quotations';
import Login from './components/Supplier/Login';
import Register from './components/Supplier/Register';
import CreateQuotation from './components/Supplier/CreateQuotation';
import EditQuotation from './components/Supplier/EditQuotation';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/create-product" element={<ProductForm isEdit={false} />} />
            <Route path="/edit-product/:id" element={<ProductForm isEdit={true} />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-quotation" element={<CreateQuotation />} />
            <Route path="/edit-quotation/:id" element={<EditQuotation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
