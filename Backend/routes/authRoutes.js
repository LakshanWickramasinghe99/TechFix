const express = require('express');
const { registerSupplier, loginSupplier } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerSupplier);
router.post('/login', loginSupplier);

module.exports = router;
