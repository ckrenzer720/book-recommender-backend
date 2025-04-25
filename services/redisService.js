const Redis = require("redis");

class RedisService {
  constructor() {
    this.client = Redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    this.client.on("error", (err) => console.error("Redis Client Error", err));
    this.client.connect();
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    // Default TTL: 1 hour
    try {
      await this.client.set(key, JSON.stringify(value), {
        EX: ttl,
      });
    } catch (error) {
      console.error("Redis set error:", error);
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error("Redis delete error:", error);
    }
  }

  // Cache key generators
  static getBookSearchKey(query, page, limit) {
    return `book:search:${query}:${page}:${limit}`;
  }

  static getBookDetailsKey(bookId) {
    return `book:details:${bookId}`;
  }

  static getUserRecommendationsKey(userId) {
    return `user:recommendations:${userId}`;
  }

  static getUserCollectionsKey(userId) {
    return `user:collections:${userId}`;
  }

  static getBookReviewsKey(bookId, page = 1, limit = 10) {
    return `book:reviews:${bookId}:${page}:${limit}`;
  }
}

module.exports = new RedisService();
