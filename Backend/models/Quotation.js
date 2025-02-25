const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  techFixRequestId: String,
  products: [{ productId: mongoose.Schema.Types.ObjectId, price: Number }],
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
});

module.exports = mongoose.model('Quotation', QuotationSchema);
