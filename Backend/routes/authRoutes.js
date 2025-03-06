const express = require("express");
const router = express.Router();
const { registerSupplier, loginSupplier, getProfile, logoutSupplier, getSupplierById, getAllSuppliers, updateSupplierById, deleteSupplier } = require("../controllers/authController");

// Define your routes here
router.post("/register", registerSupplier); // Registration route
router.post("/login", loginSupplier); // Login route
router.get("/me", getProfile); // Profile route
router.get("/:id", getSupplierById); // Get Supplier by ID
router.get("/", getAllSuppliers); // Get all suppliers
router.put("/:id", updateSupplierById); // Update supplier by ID
router.delete("/:id", deleteSupplier); // Delete supplier by ID
router.post("/logout", logoutSupplier); // Logout route

module.exports = router;
