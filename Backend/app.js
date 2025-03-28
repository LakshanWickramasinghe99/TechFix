const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const DB = process.env.MONGODB_URI;

const ProductRoutes = require("./Routes/ProductRoutes");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (Images in "Uploads" folder)
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

// API Routes
app.use("/api/products", ProductRoutes);

// MongoDB connection
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Hello, TechFix Backend is running!");
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
});
