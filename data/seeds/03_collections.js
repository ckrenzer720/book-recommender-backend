exports.seed = function (knex) {
  return knex("collections")
    .del()
    .then(function () {
      return knex("collections").insert([
        {
          user_id: 1,
          book_id: 1,
          status: "read",
        },
        {
          user_id: 1,
          book_id: 2,
          status: "wishlist",
        },
        {
          user_id: 2,
          book_id: 3,
          status: "owned",
        },
        {
          user_id: 2,
          book_id: 4,
          status: "read",
        },
        {
          user_id: 3,
          book_id: 1,
          status: "wishlist",
        },
      ]);
    });
};
