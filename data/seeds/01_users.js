exports.seed = function (knex) {
  return knex("users")
    .del()
    .then(function () {
      return knex("users").insert([
        {
          username: "bookworm123",
          email: "bookworm@example.com",
          password_hash: "$2a$10$YourHashedPasswordHere", // In real app, use bcrypt
          is_verified: true,
        },
        {
          username: "literature_lover",
          email: "literature@example.com",
          password_hash: "$2a$10$YourHashedPasswordHere",
          is_verified: true,
        },
        {
          username: "reading_enthusiast",
          email: "reading@example.com",
          password_hash: "$2a$10$YourHashedPasswordHere",
          is_verified: false,
        },
      ]);
    });
};
