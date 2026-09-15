const Home = require("../models/home");

const {
  parseRecommendationQuery,
  generateHomeRecommendations,
} = require("../services/aiRecommendationService");

const {
  generateHomeDescription,
} = require("../services/aiService");


// AI property description
exports.generateDescription = async (req, res) => {
  try {
    const { houseName, location, price, rating } = req.body;

    if (!houseName || !location || !price || !rating) {
      return res.status(400).json({
        success: false,
        message: "All home details are required.",
      });
    }

    const home = {
      houseName,
      location,
      price,
      rating,
    };

    const description = await generateHomeDescription(home);

    res.status(200).json({
      success: true,
      description,
    });

  } catch (error) {
    console.error("AI Description Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to generate AI description.",
    });
  }
};


exports.recommendHomes = async (req, res) => {
  try {
    const { query } = req.body;

    // Check user query
    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your home requirements.",
      });
    }


    // STEP 1: Parse user query using JavaScript
  

    const filters = parseRecommendationQuery(query);

    console.log("Parsed Filters:", filters);

    // STEP 2: Create MongoDB filter
   

    const mongoFilter = {};

    // Location filter
    if (filters.location) {
      mongoFilter.location = {
        $regex: filters.location,
        $options: "i",
      };
    }

    // Maximum price filter
    if (
      filters.maxPrice !== null &&
      filters.maxPrice !== undefined
    ) {
      mongoFilter.price = {
        $lte: filters.maxPrice,
      };
    }

    // Minimum rating filter
    if (
      filters.minRating !== null &&
      filters.minRating !== undefined
    ) {
      mongoFilter.rating = {
        $gte: filters.minRating,
      };
    }

    console.log("MongoDB Filter:", mongoFilter);

  
    // STEP 3: Search homes from MongoDB

    const homes = await Home.find(mongoFilter).limit(10);

    console.log("Matching Homes:", homes.length);

    // STEP 4: Response message
    

    let recommendation;

    if (homes.length === 0) {
      recommendation =
        "No matching homes were found based on your requirements.";
    } else {
      recommendation =
        `We found ${homes.length} home(s) matching your requirements.`;
    }

    // STEP 5: Send response

    res.status(200).json({
      success: true,
      filters,
      count: homes.length,
      homes,
      recommendation,
    });

  } catch (error) {
    console.error(
      "Recommendation Search Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to search homes.",
    });
  }
};