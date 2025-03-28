import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import sHome from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';  
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
  return (
    
    <ErrorBoundary>  {/* Wrapping the app with an Error Boundary */}
      <div>
        <ToastContainer />
        <Routes>
          <Route path='/shome' element={<sHome />} />
          <Route path='/login' element={<Login />} />
          <Route path='/email-verify' element={<EmailVerify />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Routes>
        <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<><Hero /><Home /><><Banner /><HomePageDown/></></>} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order-details" element={<OrderDetails />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
      </div>
    </ErrorBoundary>
  );
}

export default App;
