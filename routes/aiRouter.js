const express = require("express");
const aiController = require("../controllers/aiController");

const router = express.Router();

// AI home recommendation
router.post("/recommend", aiController.recommendHomes);

// AI property description
router.post("/description", aiController.generateDescription);

module.exports = router;