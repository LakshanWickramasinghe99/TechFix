import Products from '../Model/Product.js'; // Import the default product data

const getAllProducts = async (req, res) => {
  try {
    res.status(200).json(Products);  // Return hardcoded products
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getAllProducts };
