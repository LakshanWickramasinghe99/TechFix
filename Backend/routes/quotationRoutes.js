const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { createQuotation, getQuotations, updateQuotationStatus } = require('../controllers/quotationController');
const {createTechQuotation,getAllTechQuotations,deleteTechQuotation} = require('../controllers/TechQuatationController');
const router = express.Router();

router.post('/create', authenticate, createQuotation);
router.get('/all', authenticate, getQuotations);
router.put('/update/:id', authenticate, updateQuotationStatus);

router.post('/techfix/create', createTechQuotation);
router.get('/techfix/all', getAllTechQuotations);
router.delete('/techfix/delete/:id', deleteTechQuotation);



module.exports = router;
