exports.up = function (knex) {
  return knex.schema.createTable("collections", function (table) {
    table.increments("collection_id").primary();
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
    table.string("status").defaultTo("wishlist");
    table.timestamp("added_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("collections");
};
