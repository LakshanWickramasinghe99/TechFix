const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const DB = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(DB)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, TechFix!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
