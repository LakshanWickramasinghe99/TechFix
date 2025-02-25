const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  try {
    const { name, category, price, stock, supplierId } = req.body;
    const image = req.file ? req.file.path : null;

    const product = new Product({ name, category, price, stock, supplierId, image });
    await product.save();
    res.json({ msg: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;
    const image = req.file ? req.file.path : req.body.image;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, price, stock, image },
      { new: true }
    );
    res.json({ msg: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

  exports.deleteProduct = async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
      res.json({ msg: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };