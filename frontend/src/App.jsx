import React from 'react';
import { Routes, Route } from 'react-router-dom';
import sHome from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';  

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
      </div>
    </ErrorBoundary>
  );
}

export default App;
