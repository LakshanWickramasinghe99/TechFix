const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { createQuotation, getQuotations, updateQuotationStatus } = require('../controllers/quotationController');

const router = express.Router();

router.post('/create', authenticate, createQuotation);
router.get('/all', authenticate, getQuotations);
router.put('/update/:id', authenticate, updateQuotationStatus);

module.exports = router;
