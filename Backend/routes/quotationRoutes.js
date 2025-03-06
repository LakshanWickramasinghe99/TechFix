const express = require('express');
const {
    createQuotation,
    getQuotations,
    getQuotationById,
    updateQuotation,
    deleteQuotation
} = require('../controllers/quotationController'); // Ensure correct path
const {createTechQuotation,getAllTechQuotations,deleteTechQuotation} = require('../controllers/TechQuatationController');
const router = express.Router();

router.post('/create', createQuotation);
router.get('/all', getQuotations);
router.get('/:id', getQuotationById);
router.put('/:id', updateQuotation);
router.delete('/:id', deleteQuotation);

router.post('/techfix/create', createTechQuotation);
router.get('/techfix/all', getAllTechQuotations);
router.delete('/techfix/delete/:id', deleteTechQuotation);



module.exports = router;
