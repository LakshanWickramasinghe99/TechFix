const Quotation = require("../models/Quotation");

// Create a new quotation
exports.createQuotation = async (req, res) => {
    try {
        const { customerName, customerEmail, products } = req.body;

        if (!customerName || !customerEmail || !products || !products.length) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Calculate total price
        let totalPrice = 0;
        products.forEach(product => {
            if (!product.price || product.price < 0) {
                return res.status(400).json({ message: "Each product must have a valid price." });
            }
            totalPrice += product.price * product.quantity;
        });

        const newQuotation = new Quotation({
            customerName,
            customerEmail,
            products,
            totalPrice
        });

        await newQuotation.save();
        res.status(201).json({ message: "Quotation created successfully", quotation: newQuotation });
    } catch (error) {
        res.status(500).json({ message: "Error creating quotation", error: error.message });
    }
};
// Get all quotations
exports.getQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find();
        res.status(200).json(quotations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get quotation by ID
exports.getQuotationById = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
        res.status(200).json(quotation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a quotation
exports.updateQuotation = async (req, res) => {
    try {
        const updatedQuotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedQuotation) return res.status(404).json({ message: 'Quotation not found' });
        res.status(200).json({ message: 'Quotation updated successfully', updatedQuotation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a quotation
exports.deleteQuotation = async (req, res) => {
    try {
        const deletedQuotation = await Quotation.findByIdAndDelete(req.params.id);
        if (!deletedQuotation) return res.status(404).json({ message: 'Quotation not found' });
        res.status(200).json({ message: 'Quotation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
