import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import logo from '../assets/logo.svg';
import mail_icon from '../assets/mail_icon.svg';
import lock_icon from '../assets/lock_icon.svg';

const PasswordStrength = ({ password }) => {
  if (!password) return null;

  const strength = {
    0: 'Very Weak',
    1: 'Weak',
    2: 'Medium',
    3: 'Strong',
    4: 'Very Strong'
  };

  const calculateStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    return Math.min(score, 4);
  };

  const strengthLevel = calculateStrength();
  const width = `${(strengthLevel / 4) * 100}%`;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];

  return (
    <div className="mt-1">
      <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[strengthLevel]}`} 
          style={{ width }} 
          aria-valuenow={strengthLevel} 
          aria-valuemin="0" 
          aria-valuemax="4"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Password strength: <span className="text-white">{strength[strengthLevel]}</span>
      </p>
    </div>
  );
};

const ResetPassword = () => {
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [otpVerified, setOtpVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const inputRefs = useRef([]);

    // Handle OTP Input
    const handleInput = (e, index) => {
        const value = e.target.value.replace(/\D/g, '');
        const newOtp = [...otp];
        newOtp[index] = value ? value[0] : '';
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle Backspace key
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle OTP paste
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

    // Validate password fields
    const validatePassword = () => {
        const newErrors = {};

        if (!newPassword) {
            newErrors.newPassword = 'Password is required';
        } else {
            if (newPassword.length < 8) {
                newErrors.newPassword = 'Password must be at least 8 characters';
            } else if (!/[A-Z]/.test(newPassword)) {
                newErrors.newPassword = 'Include at least one uppercase letter';
            } else if (!/[a-z]/.test(newPassword)) {
                newErrors.newPassword = 'Include at least one lowercase letter';
            } else if (!/[0-9]/.test(newPassword)) {
                newErrors.newPassword = 'Include at least one number';
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
                newErrors.newPassword = 'Include at least one special character';
            }
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Send OTP
    const onSubmitEmail = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        if (!email) {
            toast.error('Please enter your email');
            setIsLoading(false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });

            if (data.success) {
                toast.success('OTP sent to your email');
                setIsEmailSent(true);
            } else {
                toast.error(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Send OTP Error:', error);
            toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Verify OTP
    const onSubmitOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
      
        const fullOtp = otp.join('');
        if (fullOtp.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP');
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/auth/verify-reset-otp`,
                { email, otp: fullOtp },
                { headers: { 'Content-Type': 'application/json' } }
            );
      
            if (data.success) {
                toast.success('OTP verified successfully');
                setOtpVerified(true);
            } else {
                toast.error(data.message || 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('OTP Verification Error:', error);
            toast.error(error.response?.data?.message || 'Failed to verify OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    // Submit new password
    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        
        if (!validatePassword()) {
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await axios.post(
                `${backendUrl}/api/auth/reset-password`, 
                { 
                    email, 
                    otp: otp.join(''),
                    newPassword 
                }
            );
    
            if (response.data.success) {
                toast.success('Password reset successfully! You can now login with your new password');
                navigate('/login');
            } else {
                toast.error(response.data.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Reset Password Error:', error);
            
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(error.response.data.message || 'Invalid request');
                } else if (error.response.status === 401) {
                    toast.error('Session expired. Please start the reset process again.');
                    setIsEmailSent(false);
                    setOtpVerified(false);
                } else if (error.response.status === 404) {
                    toast.error('User not found');
                } else {
                    toast.error(error.response.data.message || 'Failed to reset password');
                }
            } else {
                toast.error('Network error. Please check your connection.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 p-4">
            <img
                onClick={() => navigate('/')}
                src={logo}
                alt="Logo"
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
            />

            {/* Email Input Form */}
            {!isEmailSent && (
                <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
                    <p className="text-center mb-6 text-indigo-300">Enter your registered email address</p>
                    
                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                        <img src={mail_icon} alt="mail icon" className="w-3 h-3" />
                        <input
                            type="email"
                            placeholder="Email address"
                            className="bg-transparent outline-none text-white w-full placeholder-gray-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 hover:opacity-90 transition-opacity disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
            )}

            {/* OTP Input Form */}
            {isEmailSent && !otpVerified && (
                <form onSubmit={onSubmitOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h1 className="text-white text-2xl font-semibold text-center mb-4">Verify OTP</h1>
                    <p className="text-center mb-6 text-indigo-300">
                        Enter the 6-digit code sent to {email}
                    </p>
                    
                    <div className="flex justify-between mb-8 gap-2" onPaste={handlePaste}>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength="1"
                                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md focus:ring-2 focus:ring-indigo-500"
                                ref={(el) => (inputRefs.current[index] = el)}
                                value={otp[index]}
                                onChange={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    
                    <p className="text-center mt-4 text-gray-400 text-sm">
                        Didn't receive code?{' '}
                        <button 
                            type="button" 
                            onClick={onSubmitEmail}
                            className="text-indigo-400 hover:underline"
                        >
                            Resend OTP
                        </button>
                    </p>
                </form>
            )}

            {/* New Password Form */}
            {otpVerified && (
                <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h1 className="text-white text-2xl font-semibold text-center mb-4">Set New Password</h1>
                    
                    <div className="mb-4">
                        <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] mb-1">
                            <img src={lock_icon} alt="Lock Icon" className="w-3 h-3" />
                            <input
                                type="password"
                                placeholder="New Password (min 8 characters)"
                                className="bg-transparent outline-none text-white w-full"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    if (errors.newPassword) setErrors({...errors, newPassword: ''});
                                }}
                                required
                                minLength="8"
                                autoFocus
                            />
                        </div>
                        {errors.newPassword && (
                            <p className="text-xs text-red-500 ml-4">{errors.newPassword}</p>
                        )}
                        <PasswordStrength password={newPassword} />
                    </div>
                    
                    <div className="mb-6">
                        <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <img src={lock_icon} alt="Lock Icon" className="w-3 h-3" />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                className="bg-transparent outline-none text-white w-full"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
                                }}
                                required
                                minLength="8"
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-500 ml-4">{errors.confirmPassword}</p>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ResetPassword;