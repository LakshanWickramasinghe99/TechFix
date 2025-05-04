import Item from '../models/Item.js';
import path from 'path';

const getItems = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.brand) {
      filter.brand = req.query.brand;
    }

    const items = await Item.find(filter);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items' });
  }
};


const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item' });
  }
};

const createItem = async (req, res) => {
  try {
    const { title, price, salePrice, totalStock, description, brand, category } = req.body;

    const newItem = new Item({
      title,
      price,
      salePrice,
      totalStock,
      description,
      brand,
      category,
      image: req.file ? `/Productuploads/${req.file.filename}` : null,
    });

    await newItem.save();
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Error creating item' });
  }
};

const updateItem = async (req, res) => {
  try {
    const { title, price, salePrice, totalStock, description, brand, category } = req.body;

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        title,
        price,
        salePrice,
        totalStock,
        description,
        brand,
        category,
        image: req.file ? `/Productuploads/${req.file.filename}` : undefined,
      },
      { new: true }
    );

    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });

    res.json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};

// Exporting functions using ES Module syntax
export { createItem, getItems, getItem, updateItem, deleteItem };
