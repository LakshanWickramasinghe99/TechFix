import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        // Changed 'user' to 'userModel' (capitalization matters)
        const user = await userModel.findById(req.userId)
            .select('-password -verifyOtp -resetOtp');
            
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.status(200).json({
            success: true,
            userData: {
                id: user._id,
                name: user.name,
                email: user.email,
                // Include other fields from your schema as needed
                isAccountVerified: user.isAccountVerified,
                photo: user.photo,
                addresses: user.addresses
            }
        });
    } catch (error) {
        console.error('User data fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};