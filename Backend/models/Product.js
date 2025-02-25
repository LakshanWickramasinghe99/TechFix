const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  image: String,
});

module.exports = mongoose.model('Product', ProductSchema);
