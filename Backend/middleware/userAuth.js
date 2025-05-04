/*
import jwt from "jsonwebtoken";

const userAuth = async (req, res, next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.json({success: false, message: 'Not Authorized. login Again'});
    }

    try {

        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);

        if(tokenDecode.id){
            req.body.userId =  tokenDecode.id
        }else{
            return res({ success: false, message: 'Not Authorizes. Login Again' });
        }
            
        next();

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export default userAuth;
*/
/*import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js'; // Make sure to import your user model

const userAuth = async (req, res, next) => {
    try {
        // 1. Get token from cookies or Authorization header
        const token = req.cookies?.token || 
                     req.headers?.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token is required'
            });
        }

        // 2. Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Check if user still exists in database
        const user = await userModel.findById(decoded.id);
        if (!user) {
            res.clearCookie('token');
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // 4. Attach user ID to request
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        
        let message = 'Invalid or expired token';
        if (error.name === 'TokenExpiredError') {
            message = 'Token expired';
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Invalid token';
        }
        
        res.clearCookie('token');
        
        return res.status(401).json({
            success: false,
            message
        });
    }
};

export default userAuth;*/

import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const userAuth = async (req, res, next) => {
    try {
        // 1. Get token from multiple sources
        const token = req.cookies?.token || 
                     req.headers?.authorization?.replace('Bearer ', '') ||
                     req.body?.token;
        
        if (!token) {
            console.warn('Authentication attempt without token', {
                ip: req.ip,
                path: req.path,
                method: req.method
            });
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // 2. Verify JWT with additional checks
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256'], // Specify allowed algorithms
            ignoreExpiration: false // Explicitly check expiration
        });
        
        // 3. Validate token payload structure
        if (!decoded?.id || !decoded?.iat) {
            console.warn('Invalid token payload', { token });
            throw new jwt.JsonWebTokenError('Invalid token structure');
        }

        // 4. Check if user exists and token is still valid
        const user = await userModel.findById(decoded.id).select('+passwordChangedAt');
        if (!user) {
            console.warn('Token for non-existent user', { userId: decoded.id });
            res.clearCookie('token');
            return res.status(401).json({
                success: false,
                message: 'User account not found'
            });
        }

        // 5. Check if password was changed after token was issued
        if (user.passwordChangedAt && decoded.iat < Math.floor(user.passwordChangedAt.getTime() / 1000)) {
            console.warn('Token invalidated by password change', { 
                userId: user._id,
                tokenIssuedAt: new Date(decoded.iat * 1000),
                passwordChangedAt: user.passwordChangedAt
            });
            res.clearCookie('token');
            return res.status(401).json({
                success: false,
                message: 'Password changed recently. Please log in again.'
            });
        }

        // 6. Attach user to request with additional security checks
        req.userId = decoded.id;
        req.user = {
            _id: user._id,
            email: user.email,
            role: user.role || 'user' // Include role if you have role-based auth
        };
        
        console.log(`Authenticated request from ${user._id} (${user.email}) for ${req.method} ${req.path}`);
        next();
    } catch (error) {
        console.error('Authentication error:', {
            error: error.message,
            stack: error.stack,
            request: {
                method: req.method,
                path: req.path,
                ip: req.ip
            }
        });
        
        let message = 'Authentication failed';
        if (error.name === 'TokenExpiredError') {
            message = 'Session expired. Please log in again.';
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Invalid authentication token';
        }
        
        res.clearCookie('token');
        
        return res.status(401).json({
            success: false,
            message,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default userAuth;