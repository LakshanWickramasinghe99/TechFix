import express from 'express';
import { 
    isAuthenticated, 
    login, 
    logout, 
    register, 
    resetPassword, 
    sendResetOtp, 
    sendVerifyOtp, 
    verifyEmail, 
    verifyResetOtp 
} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

// Public routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/send-verify-otp', sendVerifyOtp);
authRouter.post('/verify-account',  verifyEmail);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/verify-reset-otp', verifyResetOtp);

// Protected routes
authRouter.post('/logout',  logout);
authRouter.post('/reset-password',  resetPassword);
authRouter.get('/is-auth', userAuth, isAuthenticated);

export { authRouter };


