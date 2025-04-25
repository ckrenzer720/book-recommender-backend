exports.up = function (knex) {
  return knex.schema.createTable("reviews", function (table) {
    table.increments("review_id").primary();
    table
      .integer("user_id")
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("book_id")
      .notNullable()
      .references("book_id")
      .inTable("books")
      .onDelete("CASCADE");
    table.integer("rating").notNullable().checkBetween([1, 5]);
    table.text("review_text");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reviews");
};
