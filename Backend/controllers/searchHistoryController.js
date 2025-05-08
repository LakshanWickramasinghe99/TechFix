import SearchHistory from "../models/SearchHistory.js";
import Item from "../models/Item.js"; // Import the Item model

// Save search history
export const saveSearchHistory = async (req, res) => {
  try {
    const { userId, searchTerm, priceOperator, priceValue } = req.body;

    if (!userId || !searchTerm) {
      return res.status(400).json({
        success: false,
        message: "User ID and search term are required",
      });
    }

    const newSearchHistory = new SearchHistory({
      userId,
      searchTerm,
      priceOperator: priceOperator || null,
      priceValue: priceValue || null,
    });

    await newSearchHistory.save();

    res.status(201).json({
      success: true,
      message: "Search history saved successfully",
      data: newSearchHistory,
    });
  } catch (error) {
    console.error("Error saving search history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save search history",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get search history for a user
export const getUserSearchHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const searchHistory = await SearchHistory.find({ userId })
      .sort({ timestamp: -1 }) // Most recent first
      .limit(50); // Limit to 50 recent searches

    res.status(200).json({
      success: true,
      count: searchHistory.length,
      data: searchHistory,
    });
  } catch (error) {
    console.error("Error fetching search history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch search history",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Recommend products based on search history
export const recommendProducts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Fetch the user's search history
    const searchHistory = await SearchHistory.find({ userId }).sort({
      timestamp: -1,
    });

    if (searchHistory.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No search history found",
        recommendations: [],
      });
    }

    // Extract unique search terms from the history
    const searchTerms = [
      ...new Set(searchHistory.map((entry) => entry.searchTerm.toLowerCase())),
    ];

    // Find products matching the search terms
    const recommendations = await Item.find({
      $or: [
        { title: { $regex: searchTerms.join("|"), $options: "i" } },
        { description: { $regex: searchTerms.join("|"), $options: "i" } },
        { brand: { $regex: searchTerms.join("|"), $options: "i" } },
        { category: { $regex: searchTerms.join("|"), $options: "i" } },
      ],
    }).limit(10); // Limit recommendations to 10 items

    res.status(200).json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
