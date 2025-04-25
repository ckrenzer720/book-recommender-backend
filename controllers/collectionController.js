const db = require("../config/dbconfig");
const redis = require("../services/redisService");

const getCollections = async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Try to get from cache first
    const cacheKey = redis.constructor.getUserCollectionsKey(userId);
    const cachedCollections = await redis.get(cacheKey);

    if (cachedCollections) {
      return res.json(cachedCollections);
    }

    const collections = await db("collections")
      .where("user_id", userId)
      .join("books", "collections.book_id", "books.book_id")
      .select(
        "collections.collection_id",
        "collections.status",
        "collections.added_at",
        "books.book_id",
        "books.title",
        "books.author",
        "books.cover_url"
      )
      .orderBy("collections.added_at", "desc");

    // Cache the collections
    await redis.set(cacheKey, collections, 1800); // Cache for 30 minutes

    res.json(collections);
  } catch (error) {
    console.error("Get collections error:", error);
    res.status(500).json({ error: "Failed to get collections" });
  }
};

const addToCollection = async (req, res) => {
  try {
    const { book_id, status = "wishlist" } = req.body;

    if (!book_id) {
      return res.status(400).json({ error: "Book ID is required" });
    }

    // Check if book exists
    const book = await db("books").where("book_id", book_id).first();
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Check if already in collection
    const existing = await db("collections")
      .where({
        user_id: req.user.user_id,
        book_id,
      })
      .first();

    if (existing) {
      return res.status(400).json({ error: "Book already in collection" });
    }

    const [collection] = await db("collections")
      .insert({
        user_id: req.user.user_id,
        book_id,
        status,
      })
      .returning("*");

    // Invalidate collections cache
    const cacheKey = redis.constructor.getUserCollectionsKey(req.user.user_id);
    await redis.del(cacheKey);

    res.status(201).json(collection);
  } catch (error) {
    console.error("Add to collection error:", error);
    res.status(500).json({ error: "Failed to add book to collection" });
  }
};

const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const [collection] = await db("collections")
      .where({
        collection_id: id,
        user_id: req.user.user_id,
      })
      .update({ status })
      .returning("*");

    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    // Invalidate collections cache
    const cacheKey = redis.constructor.getUserCollectionsKey(req.user.user_id);
    await redis.del(cacheKey);

    res.json(collection);
  } catch (error) {
    console.error("Update collection error:", error);
    res.status(500).json({ error: "Failed to update collection" });
  }
};

const removeFromCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db("collections")
      .where({
        collection_id: id,
        user_id: req.user.user_id,
      })
      .del();

    if (!deleted) {
      return res.status(404).json({ error: "Collection not found" });
    }

    // Invalidate collections cache
    const cacheKey = redis.constructor.getUserCollectionsKey(req.user.user_id);
    await redis.del(cacheKey);

    res.json({ message: "Book removed from collection" });
  } catch (error) {
    console.error("Remove from collection error:", error);
    res.status(500).json({ error: "Failed to remove book from collection" });
  }
};

module.exports = {
  getCollections,
  addToCollection,
  updateCollection,
  removeFromCollection,
};
