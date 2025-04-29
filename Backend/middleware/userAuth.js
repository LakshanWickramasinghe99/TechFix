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
import jwt from 'jsonwebtoken';
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

export default userAuth;