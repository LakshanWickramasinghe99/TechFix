const Quotation = require("../models/TechFixQuatationModel");

//add quotation to techfix
exports.createTechQuotation = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body
    const { products } = req.body;
    const quotation = new Quotation({ products });
    await quotation.save();
    res.json({ msg: "Quotation added successfully", quotation });
  } catch (error) {
    console.error("Error creating quotation:", error); // Log the error
    res.status(500).json({ msg: error.message });
  }
};

//get all quotations
exports.getAllTechQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find();
    res.json({ quotations });
  } catch (error) {
    console.error("Error getting quotations:", error); // Log the error
    res.status(500).json({ msg: error.message });
  }
};

//delete quotation
exports.deleteTechQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    await Quotation.findByIdAndDelete(id);
    res.json({ msg: "Quotation deleted successfully" });
  } catch (error) {
    console.error("Error deleting quotation:", error); // Log the error
    res.status(500).json({ msg: error.message });
  }
};