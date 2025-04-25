# Book Recommender Backend

A Node.js backend for a book recommendation application that uses OpenAI for personalized recommendations and OpenLibrary for book metadata.

## Features

- User authentication with JWT
- Book search and metadata retrieval
- Personal book collections
- AI-powered book recommendations
- Book reviews and ratings
- Email verification

## Tech Stack

- Node.js + Express
- SQLite3 with Knex.js
- JWT for authentication
- OpenAI API for recommendations
- OpenLibrary API for book data

## Project Structure

```
book-recommender-backend/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── migrations/         # Database migrations
├── models/            # Database models
├── routes/            # API routes
├── services/          # Business logic
├── utils/             # Utility functions
├── seeds/             # Database seeds
├── .env               # Environment variables
├── .gitignore         # Git ignore file
├── knexfile.js        # Knex configuration
├── package.json       # Project dependencies
└── README.md          # Project documentation
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Run migrations:
   ```bash
   npm run migrate
   ```
5. Seed the database:
   ```bash
   npm run seed
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/verify - Verify email
- GET /api/auth/me - Get current user

### Books

- GET /api/books/search - Search books
- GET /api/books/:id - Get book details
- GET /api/books/recommendations - Get AI recommendations

### Collections

- GET /api/collections - Get user's collections
- POST /api/collections - Add book to collection
- PUT /api/collections/:id - Update collection status
- DELETE /api/collections/:id - Remove from collection

### Reviews

- GET /api/reviews/book/:id - Get book reviews
- POST /api/reviews - Add review
- PUT /api/reviews/:id - Update review
- DELETE /api/reviews/:id - Delete review

## Development

- `npm run dev` - Start development server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database
- `npm run resetdb` - Reset and reseed database
- `npm test` - Run tests

## License

MIT
