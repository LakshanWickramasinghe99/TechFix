import express from 'express';
import { getAllUsers, deleteUser, updateUser } from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', getAllUsers);           // View all users
router.delete('/users/:id', deleteUser);     // Delete by ID


export default router;
