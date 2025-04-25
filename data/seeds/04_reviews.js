exports.seed = function (knex) {
  return knex("reviews")
    .del()
    .then(function () {
      return knex("reviews").insert([
        {
          user_id: 1,
          book_id: 1,
          rating: 5,
          review_text:
            "A timeless classic that captures the essence of the American Dream.",
        },
        {
          user_id: 2,
          book_id: 3,
          rating: 4,
          review_text:
            "A chilling portrayal of a dystopian future that feels increasingly relevant.",
        },
        {
          user_id: 2,
          book_id: 4,
          rating: 5,
          review_text:
            "A perfect introduction to Middle-earth. Tolkien's world-building is unmatched.",
        },
        {
          user_id: 1,
          book_id: 2,
          rating: 5,
          review_text:
            "A powerful story about justice, racism, and growing up in the American South.",
        },
      ]);
    });
};
