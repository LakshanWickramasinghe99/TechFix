import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import nlp from "compromise";
import axios from "axios"; // Add axios import

function Search() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState({
    active: false,
    operator: null,
    value: null,
  });
  const [isListening, setIsListening] = useState(false);
  const [userId, setUserId] = useState(null); // Add userId state

  // Get userId from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Clear price filter when manually typing
    setPriceFilter({ active: false, operator: null, value: null });
  };

  // Function to save search history to database
  const saveSearchHistory = async (searchData) => {
    try {
      if (!userId) return; // Only save if user is logged in

      await axios.post("http://localhost:5000/api/search-history", {
        userId,
        searchTerm: searchData.term || "",
        priceOperator: searchData.operator || null,
        priceValue: searchData.value || null,
      });

      console.log("Search history saved");
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const searchData = { term: searchTerm.trim() };

      // Save search history if user is logged in
      if (userId) {
        saveSearchHistory(searchData);
      }

      navigateToSearchResults();
    }
  };

  const navigateToSearchResults = () => {
    // Build query parameters
    const params = new URLSearchParams();
    // Make sure searchTerm is properly encoded and not empty
    if (searchTerm && searchTerm.trim()) {
      params.append("term", searchTerm.trim());
    }

    if (
      priceFilter.active &&
      priceFilter.operator &&
      priceFilter.value !== null
    ) {
      params.append("operator", priceFilter.operator);
      params.append("value", priceFilter.value);
    }

    // Navigate to search results page with query params
    navigate(`/search?${params.toString()}`);
  };

  const toggleListening = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  // Enhanced voice command processing using compromise
  const processVoiceCommand = (text) => {
    // Create a compromise document
    const doc = nlp(text);

    // Check for clear command with more flexibility
    if (doc.has("clear") || doc.has("reset")) {
      setSearchTerm("");
      setPriceFilter({ active: false, operator: null, value: null });
      return true;
    }

    // Extract price comparisons with improved pattern matching
    // Greater than patterns
    if (doc.has("(greater|more|higher|above) than #Value")) {
      // Extract product name and value
      const comparison = doc
        .match("(greater|more|higher|above) than #Value")
        .out("normal");
      const product = doc
        .not("(greater|more|higher|above) than #Value")
        .out("text")
        .trim();
      const priceMatch = comparison.match(/(\d+)/);

      if (priceMatch) {
        const price = parseFloat(priceMatch[0]);
        const productName = product || "products"; // Default to "products" if no product name found

        const searchData = {
          term: productName,
          operator: ">",
          value: price,
        };

        // Save search history if user is logged in
        if (userId) {
          saveSearchHistory(searchData);
        }

        // Navigate directly
        const params = new URLSearchParams();
        params.append("term", productName);
        params.append("operator", ">");
        params.append("value", price);
        navigate(`/search?${params.toString()}`);
        return true;
      }
    }

    // Less than patterns
    if (doc.has("(less|lower|cheaper|under|below) than #Value")) {
      const comparison = doc
        .match("(less|lower|cheaper|under|below) than #Value")
        .out("normal");
      const product = doc
        .not("(less|lower|cheaper|under|below) than #Value")
        .out("text")
        .trim();
      const priceMatch = comparison.match(/(\d+)/);

      if (priceMatch) {
        const price = parseFloat(priceMatch[0]);
        const productName = product || "products"; // Default to "products" if no product name found

        const searchData = {
          term: productName,
          operator: "<",
          value: price,
        };

        // Save search history if user is logged in
        if (userId) {
          saveSearchHistory(searchData);
        }

        // Navigate directly
        const params = new URLSearchParams();
        params.append("term", productName);
        params.append("operator", "<");
        params.append("value", price);
        navigate(`/search?${params.toString()}`);
        return true;
      }
    }

    // Equal to patterns
    if (
      doc.has("(equal|equals|is) to #Value") ||
      doc.has("(cost|costs|priced at) #Value")
    ) {
      let comparison;
      let product;

      if (doc.has("(equal|equals|is) to #Value")) {
        comparison = doc.match("(equal|equals|is) to #Value").out("normal");
        product = doc.not("(equal|equals|is) to #Value").out("text").trim();
      } else {
        comparison = doc.match("(cost|costs|priced at) #Value").out("normal");
        product = doc.not("(cost|costs|priced at) #Value").out("text").trim();
      }

      const priceMatch = comparison.match(/(\d+)/);

      if (priceMatch) {
        const price = parseFloat(priceMatch[0]);
        const productName = product || "products";

        const searchData = {
          term: productName,
          operator: "=",
          value: price,
        };

        // Save search history if user is logged in
        if (userId) {
          saveSearchHistory(searchData);
        }

        // Navigate directly
        const params = new URLSearchParams();
        params.append("term", productName);
        params.append("operator", "=");
        params.append("value", price);
        navigate(`/search?${params.toString()}`);
        return true;
      }
    }

    // For simple searches
    const keywords = doc.nouns().out("array");
    const searchQuery = keywords.length > 0 ? keywords.join(" ") : text.trim();

    if (searchQuery) {
      const searchData = {
        term: searchQuery,
      };

      // Save search history if user is logged in
      if (userId) {
        saveSearchHistory(searchData);
      }

      const params = new URLSearchParams();
      params.append("term", searchQuery);
      navigate(`/search?${params.toString()}`);
    }
    return false;
  };

  const startListening = () => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Process the voice command instead of directly setting search term
        processVoiceCommand(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="relative flex-1 max-w-xl">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 pl-3 pr-10 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={toggleListening}
          className={`absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none ${
            isListening ? "text-red-500" : ""
          }`}
          title="Say 'clear' to reset search, or try 'laptop greater than 1000'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
          title="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default Search;
