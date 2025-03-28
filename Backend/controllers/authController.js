import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

//register
export const register = async (req, res) => {
    // Validate required fields
    const { name, email, password } = req.body;
    const missingFields = [];
    
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    
    if (missingFields.length > 0) {
        return res.status(400).json({ 
            success: false, 
            message: `Missing required fields: ${missingFields.join(', ')}`
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    // Validate password strength
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters'
        });
    }

    try {
        // Check for existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: "Email already registered" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otpExpiration = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        // Create new user
        const newUser = new userModel({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            verifyOtp: otp,
            verifyOtpExpireAt: otpExpiration,
            isAccountVerified: false
        });

        // Save user to database
        const savedUser = await newUser.save();

        // Prepare email content
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Account Verification</h2>
                <p>Hello ${name},</p>
                <p>Your verification code is:</p>
                <div style="background: #f3f4f6; padding: 10px 20px; border-radius: 5px; 
                    font-size: 24px; font-weight: bold; margin: 20px 0; display: inline-block;">
                    ${otp}
                </div>
                <p>This code expires in 24 hours.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <p>Best regards,<br>The TechFix Team</p>
            </div>
        `;

        // Send verification email
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Verify Your Account',
            html: emailHtml,
            text: `Your verification code is: ${otp}\nCode expires in 24 hours.`
        });

        // Return success response
        return res.status(201).json({
            success: true,
            message: 'Verification code sent to your email',
            data: {
                userId: savedUser._id,
                email: savedUser.email,
                name: savedUser.name
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle duplicate email error separately
        if (error.code === 11000 && error.keyPattern?.email) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Handle other errors
        return res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again later.'
        });
    }
};

//login
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//logout
export const logout = async (req, res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({success: true, message: "Logged Out"});
        
    }catch (error) {
        return res.json({ success: false, message: error.message});
    }
}


//send verification OTP to the User's Email
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await user.save();

        // Send verification OTP email
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'TechFix Account Verification',
            text: `Your verification OTP is: ${otp}`,
            html: `
                <h2>TechFix Account Verification</h2>
                <p>Your verification code is: <strong>${otp}</strong></p>
                <p>This code will expire in 24 hours.</p>
            `
        });

        return res.json({ 
            success: true, 
            message: 'Verification OTP sent to your email'
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

//verify the email using the otp
export const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;  // Changed from userId to email

    if (!email || !otp) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and OTP are required' 
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        if (user.isAccountVerified) {
            return res.json({ 
                success: false, 
                message: 'Account already verified' 
            });
        }

        if (!user.verifyOtp || user.verifyOtp !== otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid OTP' 
            });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ 
                success: false, 
                message: 'OTP has expired' 
            });
        }

        // Mark account as verified
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();

        // Send welcome email
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Welcome to TechFix!',
            html: `
                <h2>Welcome to TechFix, ${user.name}!</h2>
                <p>Your account has been successfully verified.</p>
            `
        });

        // Generate auth token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
            expiresIn: '7d' 
        });

        return res.json({ 
            success: true, 
            message: 'Email verified successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Verification failed. Please try again.'
        });
    }
};

//check if user is authenticated
export const isAuthenticated = async (req, res)=>{
    try {
        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'OTP sent to your email' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//Verify reset otp
export const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }

        return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//Reset User Password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email, OTP, and new password are required' 
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters'
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid OTP' 
            });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ 
                success: false, 
                message: 'OTP has expired' 
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();

        // Send confirmation email
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Changed Successfully',
            html: `
                <h2>Password Update Notification</h2>
                <p>Your password has been successfully changed.</p>
                <p>If you didn't make this change, please contact support immediately.</p>
            `
        });

        return res.status(200).json({ 
            success: true, 
            message: 'Password has been reset successfully' 
        });

    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};
