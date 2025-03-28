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

const App = () => {
  const location = useLocation();

  // Define routes where Navbar should not be displayed
  const hideNavbarRoutes = ["/shome", "/login", "/email-verify", "/reset-password"];

  return (
    <ErrorBoundary>
      <div>
        <ToastContainer />
        {/* Conditionally render Navbar */}
        {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
        <Routes>
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
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;
