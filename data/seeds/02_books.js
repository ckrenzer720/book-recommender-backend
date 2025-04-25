exports.seed = function (knex) {
  return knex("books")
    .del()
    .then(function () {
      return knex("books").insert([
        {
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          description:
            "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
          genre: "Classic",
          isbn: "9780743273565",
          cover_url: "https://example.com/gatsby.jpg",
        },
        {
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          description:
            "The story of racial injustice and the loss of innocence in the American South.",
          genre: "Classic",
          isbn: "9780446310789",
          cover_url: "https://example.com/mockingbird.jpg",
        },
        {
          title: "1984",
          author: "George Orwell",
          description:
            "A dystopian social science fiction novel and cautionary tale.",
          genre: "Science Fiction",
          isbn: "9780451524935",
          cover_url: "https://example.com/1984.jpg",
        },
        {
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          description:
            "The adventure of Bilbo Baggins, a hobbit who embarks on a quest to help a group of dwarves.",
          genre: "Fantasy",
          isbn: "9780547928227",
          cover_url: "https://example.com/hobbit.jpg",
        },
      ]);
    });
};
