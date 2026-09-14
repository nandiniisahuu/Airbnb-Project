const { generateHomeDescription } = require("../services/aiService");

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