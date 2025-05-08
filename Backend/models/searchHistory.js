import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  searchTerm: {
    type: String,
    required: true,
  },
  priceOperator: {
    type: String,
    enum: [">", "<", "=", null],
    default: null,
  },
  priceValue: {
    type: Number,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

export default SearchHistory;
