import express from "express";
import {
  saveSearchHistory,
  getUserSearchHistory,
  recommendProducts,
} from "../controllers/searchHistoryController.js";

const router = express.Router();

// Route for saving search history
router.post("/", saveSearchHistory);

// Route for getting user search history
router.get("/user/:userId", getUserSearchHistory);

// Route for getting product recommendations based on search history
router.get("/recommendations/:userId", recommendProducts);

export default router;
