const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  supplierId: { type: String, required: true },
  image: { type: String }, // Optional image field
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
