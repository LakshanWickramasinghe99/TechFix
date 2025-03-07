const Quotation = require("../models/Quotation");

// Create a new quotation
exports.createQuotation = async (req, res) => {
    try {
        const { customerName, customerEmail, products,supplierId } = req.body;

        if (!customerName || !customerEmail || !products || !products.length) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Calculate total price
        let totalPrice = 0;
        for (let product of products) {
            if (!product.price || product.price < 0) {
                return res.status(400).json({ message: "Each product must have a valid price." });
            }
            if (!product.quantity || product.quantity < 0) {
                return res.status(400).json({ message: "Each product must have a valid quantity." });
            }
            totalPrice += product.price * product.quantity;
        }

        const newQuotation = new Quotation({
            customerName,
            customerEmail,
            products,
            totalPrice,
            supplierId
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

        if (!quotations.length) {
            return res.status(404).json({ message: "No quotations found." });
        }

        res.status(200).json(quotations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quotations", error: error.message });
    }
};


// Modify the getQuotationById controller to query by supplierId
exports.getQuotationById = async (req, res) => {
    try {
        const quotations = await Quotation.find({ supplierId: req.params.id }); // assuming 'id' is actually supplierId
        if (!quotations || quotations.length === 0) {
            return res.status(404).json({ message: 'No quotations found for this supplier' });
        }
        res.status(200).json(quotations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quotations', error: error.message });
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
