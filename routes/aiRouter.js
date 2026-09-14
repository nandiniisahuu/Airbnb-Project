const express = require("express");
const aiController = require("../controllers/aiController");

const router = express.Router();

router.post("/description", aiController.generateDescription);

module.exports = router;