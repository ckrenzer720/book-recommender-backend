const rateLimit = require("express-rate-limit");
const Redis = require("redis");
const RedisStore = require("rate-limit-redis");

// Create Redis client for rate limiting
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect();

// Default rate limiter for all routes
const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient,
    prefix: "rate-limit:",
  }),
  message: "Too many requests from this IP, please try again later.",
});

// Stricter limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient,
    prefix: "rate-limit:auth:",
  }),
  message: "Too many authentication attempts, please try again later.",
});

// Stricter limiter for book search
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient,
    prefix: "rate-limit:search:",
  }),
  message: "Too many search requests, please try again later.",
});

// Stricter limiter for recommendations
const recommendationsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient,
    prefix: "rate-limit:recommendations:",
  }),
  message: "Too many recommendation requests, please try again later.",
});

module.exports = {
  defaultLimiter,
  authLimiter,
  searchLimiter,
  recommendationsLimiter,
};
