import express from 'express';
import { createItem, getItems, getItem, updateItem, deleteItem } from '../controllers/itemController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// POST: Add a new item
router.post('/items', upload.single('image'), createItem);

// GET: Fetch all items
router.get('/items', getItems);

// GET: Fetch a single item by ID
router.get('/items/:id', getItem);

// PUT: Update an item by ID
router.put('/items/:id', upload.single('image'), updateItem);

// DELETE: Delete an item by ID
router.delete('/items/:id', deleteItem);

export default router;
