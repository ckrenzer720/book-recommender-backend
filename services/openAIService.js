const { OpenAI } = require("openai");
const db = require("../knexfile");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getRecommendations = async (userId) => {
  try {
    // Get user's reading history and preferences
    const [collections, reviews] = await Promise.all([
      db("collections")
        .where("user_id", userId)
        .join("books", "collections.book_id", "books.book_id")
        .select(
          "books.title",
          "books.author",
          "books.genre",
          "collections.status"
        ),
      db("reviews")
        .where("user_id", userId)
        .join("books", "reviews.book_id", "books.book_id")
        .select(
          "books.title",
          "books.author",
          "books.genre",
          "reviews.rating",
          "reviews.review_text"
        ),
    ]);

    // Create a prompt based on user's history
    const prompt = createPrompt(collections, reviews);

    // Get recommendations from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a knowledgeable book recommender. Provide 5 book recommendations based on the user's reading history and preferences. For each book, include the title, author, and a brief explanation of why it was recommended.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return parseRecommendations(response.choices[0].message.content);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    throw new Error("Failed to generate recommendations");
  }
};

const createPrompt = (collections, reviews) => {
  let prompt = "Based on my reading history:\n\n";

  if (collections.length > 0) {
    prompt += "Books in my collection:\n";
    collections.forEach((book) => {
      prompt += `- ${book.title} by ${book.author} (${book.status})\n`;
    });
  }

  if (reviews.length > 0) {
    prompt += "\nMy reviews:\n";
    reviews.forEach((review) => {
      prompt += `- ${review.title}: ${review.rating}/5 stars\n`;
      if (review.review_text) {
        prompt += `  Review: ${review.review_text}\n`;
      }
    });
  }

  prompt += "\nPlease recommend 5 books I might enjoy.";
  return prompt;
};

const parseRecommendations = (content) => {
  // Split the content into individual recommendations
  const recommendations = content.split("\n\n").filter((rec) => rec.trim());

  return recommendations.map((rec) => {
    const lines = rec.split("\n");
    const titleMatch = lines[0].match(/^(\d+\.\s*)?(.+)$/);
    const authorMatch = lines[1]?.match(/by\s+(.+)$/);
    const explanation = lines.slice(2).join("\n");

    return {
      title: titleMatch ? titleMatch[2].trim() : "",
      author: authorMatch ? authorMatch[1].trim() : "",
      explanation: explanation.trim(),
    };
  });
};

module.exports = {
  getRecommendations,
};
