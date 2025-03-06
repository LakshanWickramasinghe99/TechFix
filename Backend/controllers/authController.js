const Supplier = require("../models/Supplier");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Register Supplier
exports.registerSupplier = async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  try {
    let supplier = await Supplier.findOne({ email });
    if (supplier) return res.status(400).json({ msg: "Supplier already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    supplier = new Supplier({
      supplierId: `SUP-${Date.now()}-${Math.floor(Math.random() * 900) + 100}`, // Unique Supplier ID
      name,
      email,
      password: hashedPassword,
      address,
      phone,
    });

    await supplier.save();
    res.json({ msg: "Supplier registered successfully", supplierId: supplier.supplierId });
  } catch (error) {
    res.status(500).json({ msg: "Error registering supplier", error: error.message });
  }
};

// Supplier Login
exports.loginSupplier = async (req, res) => {
  const { email, password } = req.body;

  try {
    const supplier = await Supplier.findOne({ email });
    if (!supplier) return res.status(401).json({ msg: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, supplier.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid email or password" });

    // Store supplier info in session
    req.session.supplier = {
      supplierId: supplier.supplierId,
      name: supplier.name,
      email: supplier.email,
    };

    res.json({
      msg: "Login successful",
      supplierId: supplier.supplierId,
      name: supplier.name,
    });

  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get Profile of Logged-in Supplier
exports.getProfile = (req, res) => {
  if (!req.session.supplier) {
    return res.status(401).json({ msg: "Unauthorized. Please log in." });
  }

  res.json({ supplier: req.session.supplier });
};

// Logout Supplier
exports.logoutSupplier = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ msg: "Logout failed" });
    res.json({ msg: "Logout successful" });
  });
};

// Get Supplier by ID
exports.getSupplierById = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await Supplier.findOne({ supplierId: id }).select("-password");
    if (!supplier) return res.status(404).json({ msg: "Supplier not found" });

    res.json({ supplier });
  } catch (error) {
    res.status(500).json({ msg: "Error retrieving supplier", error: error.message });
  }
};

// Get All Suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().select("-password");
    res.json({ suppliers });
  } catch (error) {
    res.status(500).json({ msg: "Error retrieving suppliers", error: error.message });
  }
};

// Update Supplier
exports.updateSupplierById = async (req, res) => {
  const { id } = req.params;
  const { name, email, address, phone } = req.body;

  try {
    const supplier = await Supplier.findOne({ supplierId: id });
    if (!supplier) return res.status(404).json({ msg: "Supplier not found" });

    supplier.name = name || supplier.name;
    supplier.email = email || supplier.email;
    supplier.address = address || supplier.address;
    supplier.phone = phone || supplier.phone;

    await supplier.save();
    res.json({ msg: "Supplier updated successfully", supplier });
  } catch (error) {
    res.status(500).json({ msg: "Error updating supplier", error: error.message });
  }
};

// Delete Supplier
exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await Supplier.findOneAndDelete({ supplierId: id });
    if (!supplier) return res.status(404).json({ msg: "Supplier not found" });

    res.json({ msg: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting supplier", error: error.message });
  }
};

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    return res.status(200).json({
      status: "success",
      message: "Suppliers retrieved successfully.",
      data: suppliers,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Error retrieving active requests.",
      errors: {
        code: 500,
        description: error.message,
      },
    });
  }
};
