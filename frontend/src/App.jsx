import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Supplier/Navbar";
import Profile from "./components/Supplier/Profile";
import Home from "./components/Supplier/Home";
import Products from "./components/Supplier/ProductList";
import ProductForm from "./components/Supplier/Product"; // Create this component
import Quotations from "./components/Supplier/Quotations";
import Login from "./components/Supplier/Login";
import Register from "./components/Supplier/Register";
import CreateQuotation from "./components/Supplier/CreateQuotation";
import EditQuotation from "./components/Supplier/EditQuotation";

import HomePage from "./components/Techfix/HomePage";
import Suppliers from "./components/Techfix/Suppliers";
import Quotation from "./components/Techfix/RequestQuotation";
import Product from "./components/Techfix/Products";
import TechFixProducts from "./components/Techfix/TechFixProducts";

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const noNavbarRoutes = [
    "/techHome",
    "/suppliers",
    "/quotation",
    "/product",
    "/techFixProducts",
    "/"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route
            path="/create-product"
            element={<ProductForm isEdit={false} />}
          />
          <Route
            path="/edit-product/:id"
            element={<ProductForm isEdit={true} />}
          />
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-quotation" element={<CreateQuotation />} />
          <Route path="/edit-quotation/:id" element={<EditQuotation />} />
          <Route path="/techHome" element={<HomePage />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/quotation" element={<Quotation />} />
          <Route path="/product" element={<Product />} />
          <Route path="/techFixProducts" element={<TechFixProducts />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
