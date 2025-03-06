const Product = require('../models/TechFixProductModel');
//add product to techfix
exports.addTechFixProduct = async (req, res) => {
    try {
      const { name, category, price, stock, description } = req.body;
      const image = req.file ? req.file.path : null;
      const product = new Product({ name, category, price, stock, image, description });
      await product.save();
      res.json({ msg: 'Product added successfully', product });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

//get all products
exports.getTechFixProducts = async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };  