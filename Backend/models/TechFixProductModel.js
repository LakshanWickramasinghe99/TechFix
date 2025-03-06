const mongoose = require('mongoose');

const techFixProducts = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    stock: Number,
    image: String,
    description: String
  });
  module.exports = mongoose.model('TechFixProducts', techFixProducts);