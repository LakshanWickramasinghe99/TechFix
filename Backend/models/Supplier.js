const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  supplierId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
});

module.exports = mongoose.model("Supplier", SupplierSchema);
