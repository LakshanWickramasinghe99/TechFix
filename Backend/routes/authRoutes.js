const express = require('express');
const { registerSupplier, loginSupplier, getAllSuppliers } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerSupplier);
router.post('/login', loginSupplier);
router.post('/getAllSuppliers', getAllSuppliers);

module.exports = router;
