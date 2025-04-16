/*
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/logo.svg';
import person_icon from '../assets/person_icon.svg';
import mail_icon from '../assets/mail_icon.svg';
import lock_icon from '../assets/lock_icon.svg';

const InputField = ({ icon, type, placeholder, value, onChange, error, ...props }) => (
  <>
    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
      <img src={icon} alt={`${type} Icon`} className="w-5 h-5" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-transparent outline-none text-white w-full"
        aria-invalid={!!error}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </>
);

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

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { backendUrl, setIsLoggedin, setUserData, getUserData } = useContext(AppContext);

    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({
      name: false,
      email: false,
      password: false,
      confirmPassword: false
    });

    useEffect(() => {
        if (location.state?.fromVerification) {
            toast.dismiss();
            toast.success('Email verified successfully! Please login');
            if (location.state.email) {
                setEmail(location.state.email);
            }
        }
    }, [location.state]);

    const validateForm = () => {
        const newErrors = {};
        
        if (isSignup) {
            if (!name.trim()) newErrors.name = 'Full Name is required';
            else if (name.length > 50) newErrors.name = 'Name is too long (max 50 characters)';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else {
            if (password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            } else if (!/[A-Z]/.test(password)) {
                newErrors.password = 'Include at least one uppercase letter';
            } else if (!/[a-z]/.test(password)) {
                newErrors.password = 'Include at least one lowercase letter';
            } else if (!/[0-9]/.test(password)) {
                newErrors.password = 'Include at least one number';
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                newErrors.password = 'Include at least one special character';
            }
        }
    
        if (isSignup && password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field) => () => {
      setTouched(prev => ({ ...prev, [field]: true }));
      validateForm();
    };

    const handleLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${backendUrl}/api/auth/login`, { 
                email, 
                password 
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Login failed');
            }

            toast.dismiss();
            toast.success('Login Successful!');
            
            setIsLoggedin(true);
            getUserData();
            setUserData(response.data.user);
            navigate('/');
        } catch (error) {
            console.error("Login Error:", error);
            toast.dismiss();
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Login failed. Please check your credentials';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${backendUrl}/api/auth/register`, { 
                name, 
                email, 
                password 
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Registration failed');
            }

            toast.dismiss();
            toast.success('Verification code sent to your email!');
            navigate('/email-verify', {
                state: { 
                    email,
                    password,
                    name 
                } 
            });
        } catch (error) {
            toast.dismiss();
            const errorMsg = error.response?.data?.message || 'Registration failed';
            toast.error(errorMsg.includes('already exists') 
                ? 'This email is already registered. Please login.' 
                : errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            if (isSignup) {
                await handleSignup();
            } else {
                await handleLogin();
            }
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
            <img
                onClick={() => navigate('/')}
                src={logo} 
                alt="Logo"
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer hover:opacity-90 transition-opacity"
                tabIndex="0"
                role="button"
                aria-label="Go to homepage"
            />
            
            <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
                <h1 className="text-3xl font-semibold text-white text-center mb-3">
                    {isSignup ? 'Create Account' : 'Login'}
                </h1>
                <p className="text-center text-sm mb-6">
                    {isSignup ? 'Get started today' : 'Welcome back'}
                </p>

                <form onSubmit={onSubmit} noValidate>
                    {isSignup && (
                        <InputField
                            icon={person_icon}
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors({...errors, name: ''});
                            }}
                            onBlur={handleBlur('name')}
                            error={touched.name && errors.name}
                            aria-required="true"
                            aria-describedby="name-error"
                        />
                    )}

                    <InputField
                        icon={mail_icon}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({...errors, email: ''});
                        }}
                        onBlur={handleBlur('email')}
                        error={touched.email && errors.email}
                        aria-required="true"
                        aria-describedby="email-error"
                    />

                    <InputField
                        icon={lock_icon}
                        type="password"
                        placeholder={isSignup ? "Create password (min 8 chars)" : "Password"}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors({...errors, password: ''});
                        }}
                        onBlur={handleBlur('password')}
                        error={touched.password && errors.password}
                        aria-required="true"
                        aria-describedby="password-error"
                    />

                    {isSignup && password && <PasswordStrength password={password} />}

                    {isSignup && (
                        <InputField
                            icon={lock_icon}
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
                            }}
                            onBlur={handleBlur('confirmPassword')}
                            error={touched.confirmPassword && errors.confirmPassword}
                            aria-required="true"
                            aria-describedby="confirm-password-error"
                        />
                    )}

                    {!isSignup && (
                        <p 
                            onClick={() => navigate('/reset-password')} 
                            className="mb-4 text-indigo-400 hover:text-indigo-300 cursor-pointer text-right text-sm transition-colors"
                            tabIndex="0"
                            role="button"
                        >
                            Forgot password?
                        </p>
                    )}

                    <button 
                        type="submit"
                        className={`w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium flex items-center justify-center
                            ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90 transition-opacity'}`}
                        disabled={loading}
                        aria-busy={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : isSignup ? 'Sign Up' : 'Login'}
                    </button>
                </form>

                <p className="text-gray-400 text-center text-xs mt-4">
                    {isSignup ? (
                        <>
                            Already have an account?{' '}
                            <span 
                                onClick={() => setIsSignup(false)} 
                                className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors"
                                tabIndex="0"
                                role="button"
                            >
                                Log in
                            </span>
                        </>
                    ) : (
                        <>
                            Don't have an account?{' '}
                            <span 
                                onClick={() => setIsSignup(true)} 
                                className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors"
                                tabIndex="0"
                                role="button"
                            >
                                Sign Up
                            </span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default Login;
*/

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/logo.svg';
import person_icon from '../assets/person_icon.svg';
import mail_icon from '../assets/mail_icon.svg';
import lock_icon from '../assets/lock_icon.svg';

const InputField = ({ icon, type, placeholder, value, onChange, error, ...props }) => (
  <>
    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
      <img src={icon} alt={`${type} Icon`} className="w-5 h-5" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-transparent outline-none text-white w-full"
        aria-invalid={!!error}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </>
);

const PasswordStrength = ({ password }) => {
    if (!password) return null;
  
    const strength = {
      0: 'Very Weak',
      1: 'Weak',
      2: 'Medium',
      3: 'Strong'
    };
  
    const calculateStrength = () => {
      let score = 0;
      if (password.length >= 6) score++;
      if (/[a-zA-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      return Math.min(score, 3);
    };
  
    const strengthLevel = calculateStrength();
    const width = `${(strengthLevel / 3) * 100}%`;
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  
    return (
      <div className="mt-1">
        <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colors[strengthLevel]}`} 
            style={{ width }} 
            aria-valuenow={strengthLevel} 
            aria-valuemin="0" 
            aria-valuemax="3"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Password strength: <span className="text-white">{strength[strengthLevel]}</span>
        </p>
      </div>
    );
  };

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { backendUrl, setIsLoggedin, setUserData, getUserData } = useContext(AppContext);

    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({
      name: false,
      email: false,
      password: false,
      confirmPassword: false
    });

    useEffect(() => {
        if (location.state?.fromVerification) {
            toast.dismiss();
            toast.success('Email verified successfully! Please login');
            if (location.state.email) {
                setEmail(location.state.email);
            }
        }
    }, [location.state]);

    const validateForm = () => {
        const newErrors = {};
        
        if (isSignup) {
            if (!name.trim()) newErrors.name = 'Full Name is required';
            else if (name.length > 50) newErrors.name = 'Name is too long (max 50 characters)';
        }
    
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }
    
        if (!password) {
            newErrors.password = 'Password is required';
        } else {
            if (password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            } else if (!/[a-zA-Z]/.test(password)) {
                newErrors.password = 'Password must contain at least one letter';
            } else if (!/[0-9]/.test(password)) {
                newErrors.password = 'Password must contain at least one number';
            }
        }
    
        if (isSignup && password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field) => () => {
      setTouched(prev => ({ ...prev, [field]: true }));
      validateForm();
    };

    const handleLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${backendUrl}/api/auth/login`, { 
                email, 
                password 
            });
    
            if (!response.data.success) {
                throw new Error(response.data.message || 'Login failed');
            }
    
            toast.dismiss();
            toast.success('Login Successful!');
            
            // Update user state and context
            const { token, user } = response.data;
            
            // Set authentication state
            setIsLoggedin(true);
            
            // Store user data in context
            setUserData({
                id: user.id,
                name: user.name,
                email: user.email,
                // Add any other user data you want to store globally
            });
    
            // Store token in cookie (handled by backend)
            
            // Fetch complete user profile data
            await getUserData();
            
            // Redirect to home or intended page
            const redirectTo = location.state?.from?.pathname || '/';
            navigate(redirectTo);
            
        } catch (error) {
            console.error("Login Error:", error);
            toast.dismiss();
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Login failed. Please check your credentials';
            toast.error(errorMessage);
            
            // Clear any partial state on error
            setIsLoggedin(false);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${backendUrl}/api/auth/register`, { 
                name, 
                email, 
                password 
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Registration failed');
            }

            toast.dismiss();
            toast.success('Verification code sent to your email!');
            navigate('/email-verify', {
                state: { 
                    email,
                    password,
                    name 
                } 
            });
        } catch (error) {
            toast.dismiss();
            const errorMsg = error.response?.data?.message || 'Registration failed';
            toast.error(errorMsg.includes('already exists') 
                ? 'This email is already registered. Please login.' 
                : errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            if (isSignup) {
                await handleSignup();
            } else {
                await handleLogin();
            }
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
            <img
                onClick={() => navigate('/')}
                src={logo} 
                alt="Logo"
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer hover:opacity-90 transition-opacity"
                tabIndex="0"
                role="button"
                aria-label="Go to homepage"
            />
            
            <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
                <h1 className="text-3xl font-semibold text-white text-center mb-3">
                    {isSignup ? 'Create Account' : 'Login'}
                </h1>
                <p className="text-center text-sm mb-6">
                    {isSignup ? 'Get started today' : 'Welcome back'}
                </p>

                <form onSubmit={onSubmit} noValidate>
                    {isSignup && (
                        <InputField
                            icon={person_icon}
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors({...errors, name: ''});
                            }}
                            onBlur={handleBlur('name')}
                            error={touched.name && errors.name}
                            aria-required="true"
                            aria-describedby="name-error"
                        />
                    )}

                    <InputField
                        icon={mail_icon}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({...errors, email: ''});
                        }}
                        onBlur={handleBlur('email')}
                        error={touched.email && errors.email}
                        aria-required="true"
                        aria-describedby="email-error"
                    />

                    <InputField
                        icon={lock_icon}
                        type="password"
                        placeholder={isSignup ? "Create password (min 6 chars with letters & numbers)" : "Password"}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors({...errors, password: ''});
                        }}
                        onBlur={handleBlur('password')}
                        error={touched.password && errors.password}
                        aria-required="true"
                        aria-describedby="password-error"
                    />

                    {isSignup && password && <PasswordStrength password={password} />}

                    {isSignup && (
                        <InputField
                            icon={lock_icon}
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
                            }}
                            onBlur={handleBlur('confirmPassword')}
                            error={touched.confirmPassword && errors.confirmPassword}
                            aria-required="true"
                            aria-describedby="confirm-password-error"
                        />
                    )}

                    {!isSignup && (
                        <p 
                            onClick={() => navigate('/reset-password')} 
                            className="mb-4 text-indigo-400 hover:text-indigo-300 cursor-pointer text-right text-sm transition-colors"
                            tabIndex="0"
                            role="button"
                        >
                            Forgot password?
                        </p>
                    )}

                    <button 
                        type="submit"
                        className={`w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium flex items-center justify-center
                            ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90 transition-opacity'}`}
                        disabled={loading}
                        aria-busy={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : isSignup ? 'Sign Up' : 'Login'}
                    </button>
                </form>

                <p className="text-gray-400 text-center text-xs mt-4">
                    {isSignup ? (
                        <>
                            Already have an account?{' '}
                            <span 
                                onClick={() => setIsSignup(false)} 
                                className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors"
                                tabIndex="0"
                                role="button"
                            >
                                Log in
                            </span>
                        </>
                    ) : (
                        <>
                            Don't have an account?{' '}
                            <span 
                                onClick={() => setIsSignup(true)} 
                                className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors"
                                tabIndex="0"
                                role="button"
                            >
                                Sign Up
                            </span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default Login;