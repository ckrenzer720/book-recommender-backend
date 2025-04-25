const knex = require("knex");
const knexConfig = require("../knexfile");

// Get the environment (default to development)
const environment = process.env.NODE_ENV || "development";

// Create and export the database connection
const db = knex(knexConfig[environment]);

// Export the database instance
module.exports = db;
