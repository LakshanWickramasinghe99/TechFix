import express from 'express';
import userAuth from '../middleware/userAuth.js';
import {
  getProfile,
  updateDetails,
  updateAddress,
  deleteAddress,
  addPurchase,
  getPurchases,
  generateReport,
  deleteAccount,
  getCountries,
  updatePhoto,
  getUserBasicData
} from '../controllers/profileController.js';

const router = express.Router();

// Profile routes
router.get('/',userAuth, getProfile); 
router.get('/basic',userAuth, getUserBasicData);
router.put('/updateDetails',userAuth, updateDetails);
router.put('/photo', updatePhoto);

// Address routes
router.post('/address', userAuth, updateAddress);
router.put('/address',userAuth, updateAddress);
router.delete('/address',userAuth, deleteAddress);
/*router.put('/address/primary', setPrimaryAddress);*/

// Purchase routes
router.post('/purchases', addPurchase);
router.get('/purchases', getPurchases);

// Report routes
router.post('/reports', generateReport);

// Utility routes
router.get('/countries', getCountries);

// Account management
router.delete('/account', userAuth, deleteAccount);
export default router;