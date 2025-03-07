const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    products: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true } // Added price field
        }
    ],
    totalPrice: { type: Number, required: true }, // New field for total price
    createdAt: { type: Date, default: Date.now },
    supplierId: { type: String, required: true }
});

module.exports = mongoose.model('Quotation', QuotationSchema);
