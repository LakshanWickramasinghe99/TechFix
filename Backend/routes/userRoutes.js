import express from 'express';
import { 
    getUserData,
} from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

// Protected routes
router.get('/data', userAuth, getUserData);
// Add if needed:
// router.put('/update', userAuth, updateUserData);

export default router;