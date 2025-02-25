const Quotation = require('../models/Quotation');

exports.createQuotation = async (req, res) => {
  try {
    const { techFixRequestId, products } = req.body;
    const newQuotation = new Quotation({
      supplierId: req.supplier.supplierId,
      techFixRequestId,
      products,
    });

    await newQuotation.save();
    res.json({ msg: 'Quotation created successfully', quotation: newQuotation });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find({ supplierId: req.supplier.supplierId }).populate('products.productId');
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.updateQuotationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const quotation = await Quotation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ msg: 'Quotation status updated', quotation });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
