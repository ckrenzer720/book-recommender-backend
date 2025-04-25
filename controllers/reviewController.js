const db = require("../config/dbconfig");
const redis = require("../services/redisService");

const getBookReviews = async (req, res) => {
  try {
    const { book_id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Try to get from cache first
    const cacheKey = redis.constructor.getBookReviewsKey(book_id, page, limit);
    const cachedReviews = await redis.get(cacheKey);

    if (cachedReviews) {
      return res.json(cachedReviews);
    }

    // Get reviews with pagination
    const reviews = await db("reviews")
      .where("book_id", book_id)
      .join("users", "reviews.user_id", "users.user_id")
      .select(
        "reviews.review_id",
        "reviews.rating",
        "reviews.review_text",
        "reviews.created_at",
        "users.username"
      )
      .orderBy("reviews.created_at", "desc")
      .limit(limit)
      .offset((page - 1) * limit);

    // Get total count and average rating
    const [{ count }] = await db("reviews")
      .where("book_id", book_id)
      .count("review_id as count");

    const [{ avg }] = await db("reviews")
      .where("book_id", book_id)
      .avg("rating as avg");

    const response = {
      reviews,
      pagination: {
        total: parseInt(count),
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
      average_rating: avg ? parseFloat(avg).toFixed(2) : null,
    };

    // Cache the reviews
    await redis.set(cacheKey, response, 1800); // Cache for 30 minutes

    res.json(response);
  } catch (error) {
    console.error("Get book reviews error:", error);
    res.status(500).json({ error: "Failed to get book reviews" });
  }
};

const addReview = async (req, res) => {
  try {
    const { book_id, rating, review_text } = req.body;

    if (!book_id || !rating) {
      return res.status(400).json({ error: "Book ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if book exists
    const book = await db("books").where("book_id", book_id).first();
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Check if user has already reviewed this book
    const existingReview = await db("reviews")
      .where({
        user_id: req.user.user_id,
        book_id,
      })
      .first();

    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this book" });
    }

    const [review] = await db("reviews")
      .insert({
        user_id: req.user.user_id,
        book_id,
        rating,
        review_text,
      })
      .returning("*");

    // Invalidate reviews cache for this book
    const cacheKey = redis.constructor.getBookReviewsKey(book_id);
    await redis.del(cacheKey);

    res.status(201).json(review);
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review_text } = req.body;

    if (!rating && !review_text) {
      return res
        .status(400)
        .json({ error: "Rating or review text is required" });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const [review] = await db("reviews")
      .where({
        review_id: id,
        user_id: req.user.user_id,
      })
      .update({
        rating,
        review_text,
        updated_at: new Date(),
      })
      .returning("*");

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Invalidate reviews cache for this book
    const cacheKey = redis.constructor.getBookReviewsKey(review.book_id);
    await redis.del(cacheKey);

    res.json(review);
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const [review] = await db("reviews")
      .where({
        review_id: id,
        user_id: req.user.user_id,
      })
      .del()
      .returning("*");

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Invalidate reviews cache for this book
    const cacheKey = redis.constructor.getBookReviewsKey(review.book_id);
    await redis.del(cacheKey);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
};

module.exports = {
  getBookReviews,
  addReview,
  updateReview,
  deleteReview,
};
