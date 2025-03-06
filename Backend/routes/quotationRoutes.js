const express = require('express');
const {
    createQuotation,
    getQuotations,
    getQuotationById,
    updateQuotation,
    deleteQuotation
} = require('../controllers/quotationController'); // Ensure correct path

const router = express.Router();

router.post('/create', createQuotation);
router.get('/all', getQuotations);
router.get('/:id', getQuotationById);
router.put('/:id', updateQuotation);
router.delete('/:id', deleteQuotation);

module.exports = router;
