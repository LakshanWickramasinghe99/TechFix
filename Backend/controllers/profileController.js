import userModel from '../models/userModel.js';
import { countries } from 'countries-list';
import { format } from 'date-fns';
import validator from 'validator';

// Helper function to get country list
const getCountryList = () => {
  return Object.values(countries).map(country => country.name).sort();
};

// Get user profile data
export const getProfile = async (req, res) => {
  try {
    // Add debug log
    console.log(`Fetching profile for user: ${req.userId}`);

    const user = await userModel.findById(req.userId)
      .select('-password -verifyOtp -resetOtp')
      .lean(); // Convert to plain JS object

    if (!user) {
      console.error(`User ${req.userId} not found in database`);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Structure response data
    const response = {
      success: true,
      userData: {
        _id: user._id, // Include user ID
        email: user.email,
        name: user.name,
        nickname: user.nickname || '',
        birthyear: user.birthyear || null,
        gender: user.gender || 'Prefer not to say',
        country: user.country || '',
        photo: user.photo || '',
        isAccountVerified: user.isAccountVerified || false
      }
    };

    console.log('Returning profile data:', response);
    res.status(200).json(response);

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile data'
    });
  }
};

// Update user details
// In your updateDetails controller
// Update user details - Improved version
export const updateDetails = async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.userId,
      {
        nickname: req.body.nickname,
        birthyear: req.body.birthyear,
        gender: req.body.gender,
        country: req.body.country
      },
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validations
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      userData: {
        email: updatedUser.email,
        name: updatedUser.name,
        nickname: updatedUser.nickname,
        birthyear: updatedUser.birthyear,
        gender: updatedUser.gender,
        country: updatedUser.country,
        photo: updatedUser.photo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get basic user data (email and name)
export const getUserBasicData = async (req, res) => {
    try {
      const user = await userModel.findById(req.userId)
        .select('email name');
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.status(200).json({ 
        success: true, 
        userData: {
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch user data',
        error: error.message 
      });
    }
  };

// Add or update address
// Update address endpoint
export const updateAddress = async (req, res) => {
  try {
    const { addresses } = req.body;
    const userId = req.userId;

    // Validate input
    if (!Array.isArray(addresses)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Addresses must be an array' 
      });
    }

    // Validate each address has required fields
    for (const address of addresses) {
      if (!address._id || !address.type || !address.streetNumber || !address.streetName || !address.city) {
        return res.status(400).json({
          success: false,
          message: 'Each address must have _id, type, streetNumber, streetName, and city'
        });
      }
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { addresses },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('addresses');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      addresses: user.addresses 
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update addresses',
      error: error.message 
    });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if address exists
    const addressExists = user.addresses.some(addr => addr._id.toString() === addressId.toString());
    if (!addressExists) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Remove the address
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId.toString());
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Address deleted',
      addresses: user.addresses 
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete address',
      error: error.message 
    });
  }
};

// Set primary address
/*export const setPrimaryAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the address and verify it exists
    const address = user.addresses.find(addr => addr._id.toString() === addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Set all addresses to non-primary first
    user.addresses.forEach(addr => { addr.isPrimary = false; });
    
    // Set the selected address as primary
    address.isPrimary = true;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Primary address updated',
      addresses: user.addresses 
    });
  } catch (error) {
    console.error('Set primary address error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to set primary address',
      error: error.message 
    });
  }
};*/

// Add purchase
export const addPurchase = async (req, res) => {
  try {
    const { item, quantity, amount } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.purchases.push({ item, quantity, amount });
    await user.save();

    res.status(201).json({ 
      success: true, 
      message: 'Purchase recorded',
      purchase: user.purchases[user.purchases.length - 1] 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to record purchase',
      error: error.message 
    });
  }
};

// Get purchase history
export const getPurchases = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId)
      .select('purchases');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Format purchases with readable dates
    const formattedPurchases = user.purchases.map(purchase => ({
      ...purchase.toObject(),
      date: format(purchase.date, 'MMM dd, yyyy')
    }));

    res.status(200).json({ 
      success: true, 
      purchases: formattedPurchases 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch purchases',
      error: error.message 
    });
  }
};

// Generate report
export const generateReport = async (req, res) => {
  try {
    const { reportType, format } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // In a real implementation, you would generate an actual report file
    // This is a simplified version that returns the data
    let reportData = {};
    
    switch (reportType) {
      case 'purchase':
        reportData = {
          type: 'Purchase History',
          generatedAt: new Date(),
          data: user.purchases
        };
        break;
      case 'user':
        reportData = {
          type: 'User Details',
          generatedAt: new Date(),
          data: {
            name: user.name,
            email: user.email,
            joined: user.createdAt,
            addresses: user.addresses.length,
            purchases: user.purchases.length
          }
        };
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid report type' 
        });
    }

    res.status(200).json({ 
      success: true, 
      message: `Report generated in ${format} format`,
      report: reportData 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate report',
      error: error.message 
    });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Clear auth cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    // Send confirmation email
    // (You would implement your email sending logic here)

    res.status(200).json({ 
      success: true, 
      message: 'Account deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete account',
      error: error.message 
    });
  }
};

// Get country list
export const getCountries = async (req, res) => {
  try {
    const countryList = getCountryList();
    res.status(200).json({ 
      success: true, 
      countries: countryList 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch countries',
      error: error.message 
    });
  }
};

// Update profile photo
export const updatePhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.userId,
      { photo: photoUrl },
      { new: true, select: '-password' }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Photo updated successfully',
      userData: user 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update photo',
      error: error.message 
    });
  }
};