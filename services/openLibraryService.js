const axios = require("axios");

const BASE_URL = "https://openlibrary.org";

const searchBooks = async (query, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: {
        q: query,
        page,
        limit,
      },
    });

    return response.data.docs.map((book) => ({
      title: book.title,
      author: book.author_name?.[0] || "Unknown Author",
      isbn: book.isbn?.[0],
      cover_url: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : null,
      description: book.first_sentence?.[0] || "No description available",
      genre: book.subject?.[0] || "Unknown Genre",
    }));
  } catch (error) {
    console.error("Error searching books:", error);
    throw new Error("Failed to search books");
  }
};

const getBookDetails = async (isbn) => {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}.json`);
    const book = response.data;

    // Get author details
    const authorId = book.authors?.[0]?.key;
    const authorResponse = await axios.get(`${BASE_URL}${authorId}.json`);
    const author = authorResponse.data;

    return {
      title: book.title,
      author: author.name || "Unknown Author",
      isbn: isbn,
      cover_url: book.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
        : null,
      description:
        book.description?.value ||
        book.first_sentence?.[0] ||
        "No description available",
      genre: book.subjects?.[0] || "Unknown Genre",
      publish_date: book.publish_date,
      publisher: book.publishers?.[0],
    };
  } catch (error) {
    console.error("Error getting book details:", error);
    throw new Error("Failed to get book details");
  }
};

module.exports = {
  searchBooks,
  getBookDetails,
};
