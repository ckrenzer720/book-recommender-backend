const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  search,
  getBook,
  getBookRecommendations,
} = require("../controllers/bookController");
const {
  searchValidation,
  bookIdValidation,
} = require("../middleware/validators");
const {
  searchLimiter,
  recommendationsLimiter,
} = require("../middleware/rateLimiter");
const { validate } = require("express-validator");

// Public routes
router.get("/search", searchLimiter, searchValidation, validate, search);
router.get("/:id", bookIdValidation, validate, getBook);

// Protected routes
router.get(
  "/recommendations",
  recommendationsLimiter,
  authenticateToken,
  getBookRecommendations
);

module.exports = router;
