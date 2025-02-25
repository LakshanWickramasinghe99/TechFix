const Supplier = require('../models/Supplier');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registerSupplier = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let supplier = await Supplier.findOne({ email });
    if (supplier) return res.status(400).json({ msg: 'Supplier already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    supplier = new Supplier({ name, email, password: hashedPassword });

    await supplier.save();
    res.json({ msg: 'Supplier registered successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.loginSupplier = async (req, res) => {
  const { email, password } = req.body;

  try {
    const supplier = await Supplier.findOne({ email });
    if (!supplier) return res.status(400).json({ msg: 'Supplier not found' });

    const isMatch = await bcrypt.compare(password, supplier.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ supplierId: supplier._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
