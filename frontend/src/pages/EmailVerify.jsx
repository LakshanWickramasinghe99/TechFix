/*
import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import logo from '../assets/logo.svg';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  
  const { backendUrl, getUserData, isLoggedin, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const inputRefs = useRef(Array(6).fill(null));


  const handleInput = (e, index) => {
    const { value } = e.target;

    // Allow only numbers
    if (!/^\d*$/.test(value)) {
      e.target.value = '';
      return;
    }

    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    const pasteArray = pasteData.split('').filter(char => /^\d$/.test(char)).slice(0, 6);

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });

    if (inputRefs.current[pasteArray.length]) {
      inputRefs.current[pasteArray.length].focus();
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const otpArray = inputRefs.current.map(input => input.value);
    const otp = otpArray.join('');

    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP.");
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedin, userData, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate('/')}
        src={logo} 
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email.</p>
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array.from({ length: 6 }).map((_, index) => (
            <input 
              type="text" 
              maxLength="1" 
              key={index} 
              required
              className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
              ref={(el) => (inputRefs.current[index] = el)}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
        <button type="submit" className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white'>
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
*/


import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/logo.svg';

const EmailVerify = () => {
    const { backendUrl, setIsLoggedin, setUserData, getUserData } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const inputRefs = useRef(Array(6).fill(null));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(Array(6).fill('')); 
    useEffect(() => {
        if (!location.state?.email) {
            toast.error('No verification data found');
            navigate('/signup');
            return;
        }

        setEmail(location.state.email);
        if (location.state.password) {
            setPassword(location.state.password);
        }
        
        inputRefs.current[0]?.focus();
    }, [location, navigate]);

    const handleInput = (e, index) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (!value && e.nativeEvent.inputType !== 'deleteContentBackward') return;

        const newOtp = [...otp];
        newOtp[index] = value ? value[0] : '';
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').trim();
        const digits = pasteData.match(/\d/g)?.slice(0, 6) || [];
        
        const newOtp = [...otp];
        digits.forEach((digit, index) => {
            newOtp[index] = digit;
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = digit;
            }
        });
        
        setOtp(newOtp);
        inputRefs.current[Math.min(digits.length, 5)]?.focus();
    };

    const verifyOtp = async () => {
        const fullOtp = otp.join('');
        if (fullOtp.length !== 6) {
            toast.error('Please enter a 6-digit code');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `${backendUrl}/api/auth/verify-account`,
                { email, otp: fullOtp }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Verification failed');
            }

            // Attempt auto-login if password is available
            if (password) {
                try {
                    const loginResponse = await axios.post(`${backendUrl}/api/auth/login`, {
                        email,
                        password
                    });

                    if (loginResponse.data.success) {
                        setIsLoggedin(true);
                        setUserData(loginResponse.data.user);
                        await getUserData();
                        toast.dismiss();
                        toast.success('Account verified and logged in successfully!');
                        navigate('/');
                        return; 
                    }
                } catch (loginError) {
                    console.log("Auto-login failed, proceeding with verification only");
                }
            }

            // Verification success without auto-login
            toast.dismiss();
            toast.success(response.data.message || 'Account verified successfully!');
            navigate('/login', { 
                state: { 
                    fromVerification: true,
                    email 
                } 
            });
        } catch (err) {
            console.error('Verification error:', err);
            setError(err.response?.data?.message || err.message || 'Verification failed');
            toast.dismiss();
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, { email });
            toast.dismiss();
            toast.success(response.data.message || 'New verification code sent!');
            setOtp(Array(6).fill('')); // Clear existing OTP
            inputRefs.current[0]?.focus(); // Focus first input
        } catch (err) {
            toast.dismiss();
            toast.error(err.response?.data?.message || 'Failed to resend code');
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p>Loading verification data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
            <img
                onClick={() => navigate('/')}
                src={logo} 
                alt="Logo"
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
                role="button"
                tabIndex="0"
            />
            
            <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
                <h2 className="text-2xl font-semibold text-white text-center mb-3">Verify Your Email</h2>
                <p className="text-center text-sm mb-2">We sent a 6-digit code to:</p>
                <p className="text-center text-white font-medium mb-6">{email}</p>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    verifyOtp();
                }} onPaste={handlePaste}>
                    <div className="flex justify-between mb-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={otp[index]}
                                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                                onChange={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                required
                                disabled={loading}
                                aria-label={`Digit ${index + 1} of verification code`}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium mb-4
                            ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'}`}
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify Account'}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400">
                    Didn't receive a code?{' '}
                    <button
                        onClick={resendCode}
                        className={`text-blue-400 ${loading ? 'opacity-50' : 'hover:underline'}`}
                        disabled={loading}
                        type="button"
                    >
                        Resend Code
                    </button>
                </p>
            </div>
        </div>
    );
};

export default EmailVerify;
