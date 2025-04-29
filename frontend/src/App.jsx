import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import SHome from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./Components/User/Home";
import Navbar from "./Components/Tharaka/Navbar";
import Hero from "./Components/Tharaka/Hero";
import Product from "./Components/Tharaka/product";
import Banner from "./Components/Tharaka/Banner";
import HomePageDown from "./Components/Tharaka/HomePageDown";
import Order from "./Components/Tharaka/Order";
import OrderDetails from "./Components/Tharaka/OrderDetails";
import Cart from "./Components/Tharaka/Cart";
import AddProductPage from "./Components/Nalinda/pages/addproductpage";
import ProductList from "./Components/Nalinda/pages/productlist";
import Dashboard from "./Components/Nalinda/pages/dashboard";
import Analytics from "./Components/Nalinda/pages/analytics";
import EditProduct from "./Components/Nalinda/editproduct";

import AddressSection from "./pages/Profile/AddressSection";
import DeleteAccountSection from "./pages/Profile/DeleteAccountSection";
import DetailsSection from "./pages/Profile/DetailsSection";
import PurchasesSection from "./pages/Profile/PurchasesSection";
import ReportsSection from "./pages/Profile/ReportsSection";
import Sidebar from "./pages/Profile/Sidebar";
import Profile from "./pages/Profile/Profile";

import AdminLayout from "./Components/Nalinda/adminlayout";
import ItemDetails from "./Components/Nalinda/pages/productview";





const App = () => {
  const location = useLocation();

  // Define routes where Navbar should not be displayed

  const hideNavbarRoutes = ["/shome", "/login", "/email-verify", "/reset-password","/admin","/admin/products","/admin/productview/:id","/admin/editproduct/:id",
    "/admin/dashboard", "/admin/analytics" , "/admin/addproduct"
  ];

  return (

    <ErrorBoundary>
      <div>
        <ToastContainer />
        {/* Conditionally render Navbar */}
        {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/email-verify' element={<EmailVerify />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/address-section' element={<AddressSection />} />
          <Route path='/delete-account-section' element={<DeleteAccountSection />} />
          <Route path='/details-section' element={<DetailsSection />} />

          <Route path='/profile' element={<Profile />} />
          <Route path='/purchase-section' element={<PurchasesSection />} />
          <Route path='/reports-section' element={<ReportsSection />} />
          <Route path='/sidebar' element={<Sidebar />} />

          <Route path="/shome" element={<SHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-verify" element={<EmailVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Home />
                <>
                  <Banner />
                  <HomePageDown />
                </>
              </>
            }
          />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/cart" element={<Cart />} />
            

          <Route path="/admin" element={<AdminLayout />}>
        <Route path="products" element={<ProductList />} />
        <Route path="/admin/productview/:id" element={<ItemDetails/>} />
        <Route path="/admin/editproduct/:id" element={<EditProduct />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="addproduct" element={<AddProductPage />} /> 
        </Route>

        </Routes>

      </div>
    </ErrorBoundary>
  );
};

export default App;
