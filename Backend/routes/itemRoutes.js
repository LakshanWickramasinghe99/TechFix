/*import express from 'express';
import { createItem, getItems, getItem, updateItem, deleteItem } from '../controllers/itemController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/api/categories', async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories' });
    }
  });
  

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

export default router;*/

import express from 'express';
import { createItem, getItems, getItem, updateItem, deleteItem } from '../controllers/itemController.js';
import upload from '../middleware/upload.js';
import Item from '../models/Item.js';

const router = express.Router();

// GET: Search items by title (case-insensitive)
router.get('/items/search/:query', async (req, res) => {
  try {
    const regex = new RegExp(req.params.query, 'i'); // case-insensitive
    const items = await Item.find({ title: regex });
    res.json(items);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error searching items' });
  }
});

// Existing item routes
router.post('/items', upload.single('image'), createItem);
router.get('/items', getItems);
router.get('/items/:id', getItem);
router.put('/items/:id', upload.single('image'), updateItem);
router.delete('/items/:id', deleteItem);

export default router;

