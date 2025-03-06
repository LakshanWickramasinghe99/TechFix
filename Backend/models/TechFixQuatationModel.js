const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const TechFixQuatationSchema = new mongoose.Schema({
  products: [ProductSchema],
  createdDTM: {
    type: Date,
    default: () =>
      new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }),
  },
});

module.exports = mongoose.model("TechFixQuatation", TechFixQuatationSchema);
