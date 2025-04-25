const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  getBookReviews,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const {
  reviewValidation,
  reviewIdValidation,
} = require("../middleware/validators");
const { validate } = require("express-validator");

// Public routes
router.get("/book/:book_id", reviewIdValidation, validate, getBookReviews);

// Protected routes
router.use(authenticateToken);
router.post("/", reviewValidation, validate, addReview);
router.put(
  "/:id",
  reviewIdValidation,
  reviewValidation,
  validate,
  updateReview
);
router.delete("/:id", reviewIdValidation, validate, deleteReview);

module.exports = router;
