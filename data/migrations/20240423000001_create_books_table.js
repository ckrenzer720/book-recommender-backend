exports.up = function (knex) {
  return knex.schema.createTable("books", function (table) {
    table.increments("book_id").primary();
    table.string("title").notNullable();
    table.string("author").notNullable();
    table.text("description");
    table.string("genre");
    table.string("isbn").unique();
    table.string("cover_url");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("books");
};
