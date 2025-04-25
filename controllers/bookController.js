const db = require("../config/dbconfig");
const {
  searchBooks,
  getBookDetails,
} = require("../services/openLibraryService");
const { getRecommendations } = require("../services/openAIService");
const redis = require("../services/redisService");

const search = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Try to get from cache first
    const cacheKey = redis.constructor.getBookSearchKey(query, page, limit);
    const cachedResults = await redis.get(cacheKey);

    if (cachedResults) {
      return res.json(cachedResults);
    }

    // If not in cache, fetch from API
    const results = await searchBooks(query, parseInt(page), parseInt(limit));

    // Cache the results
    await redis.set(cacheKey, results, 1800); // Cache for 30 minutes

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search books" });
  }
};

const getBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to get from cache first
    const cacheKey = redis.constructor.getBookDetailsKey(id);
    const cachedBook = await redis.get(cacheKey);

    if (cachedBook) {
      return res.json(cachedBook);
    }

    // First check if book exists in our database
    let book = await db("books").where("book_id", id).first();

    if (!book) {
      // If not in our database, try to get from OpenLibrary
      const openLibraryBook = await getBookDetails(id);

      // Save to our database for future reference
      [book] = await db("books")
        .insert({
          title: openLibraryBook.title,
          author: openLibraryBook.author,
          isbn: openLibraryBook.isbn,
          cover_url: openLibraryBook.cover_url,
          description: openLibraryBook.description,
          genre: openLibraryBook.genre,
        })
        .returning("*");
    }

    // Get average rating and review count
    const reviews = await db("reviews")
      .where("book_id", book.book_id)
      .select("rating");

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : null;

    const bookWithStats = {
      ...book,
      average_rating: averageRating,
      review_count: reviews.length,
    };

    // Cache the book details
    await redis.set(cacheKey, bookWithStats, 3600); // Cache for 1 hour

    res.json(bookWithStats);
  } catch (error) {
    console.error("Get book error:", error);
    res.status(500).json({ error: "Failed to get book details" });
  }
};

const getBookRecommendations = async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Try to get from cache first
    const cacheKey = redis.constructor.getUserRecommendationsKey(userId);
    const cachedRecommendations = await redis.get(cacheKey);

    if (cachedRecommendations) {
      return res.json(cachedRecommendations);
    }

    const recommendations = await getRecommendations(userId);

    // Cache the recommendations
    await redis.set(cacheKey, recommendations, 86400); // Cache for 24 hours

    res.json(recommendations);
  } catch (error) {
    console.error("Get recommendations error:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
};

module.exports = {
  search,
  getBook,
  getBookRecommendations,
};
