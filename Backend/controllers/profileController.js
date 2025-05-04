import userModel from '../models/userModel.js';
import { countries } from 'countries-list';
import { format } from 'date-fns';
import validator from 'validator';
import bcrypt from 'bcryptjs';

// Helper function to get country list
const getCountryList = () => {
  return Object.values(countries).map(country => country.name).sort();
};

// Get user profile data 
export const getProfile = async (req, res) => {
  try {
    // Validate user exists in request (set by auth middleware)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }

    const user = await userModel.findById(req.user._id)
      .select('-password -verifyOtp -resetOtp -__v')
      .lean();

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Return sanitized user data
    const response = {
      success: true,
      userData: {
        _id: user._id,
        email: user.email,
        name: user.name,
        nickname: user.nickname || '',
        birthyear: user.birthyear || null,
        gender: user.gender || 'Prefer not to say',
        country: user.country || '',
        photo: user.photo || '',
        isAccountVerified: user.isAccountVerified || false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        addresses: user.addresses || [],
        purchases: user.purchases || []
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile data'
    });
  }
};

export const updateDetails = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.nickname = req.body.nickname;
    user.birthyear = req.body.birthyear;
    user.gender = req.body.gender;
    user.country = req.body.country;

    await user.save();

    res.status(200).json({
      success: true,
      userData: {
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        birthyear: user.birthyear,
        gender: user.gender,
        country: user.country,
        photo: user.photo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

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

export const updateAddress = async (req, res) => {
  try {
    const { addresses } = req.body;

    if (!Array.isArray(addresses)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Addresses must be an array' 
      });
    }

    for (const address of addresses) {
      if (!address._id || !address.type || !address.streetNumber || !address.streetName || !address.city) {
        return res.status(400).json({
          success: false,
          message: 'Each address must have _id, type, streetNumber, streetName, and city'
        });
      }
    }

    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.addresses = addresses;
    await user.save();

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

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const addressExists = user.addresses.some(addr => addr._id.toString() === addressId.toString());
    if (!addressExists) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

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

export const getPurchases = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId)
      .select('purchases');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

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

export const generateReport = async (req, res) => {
  try {
    const { reportType, format } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

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
            _id: user._id,
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

export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required for account deletion'
      });
    }

    const user = await userModel.findById(req.userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    await userModel.findByIdAndDelete(user._id);

    return res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
};

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
