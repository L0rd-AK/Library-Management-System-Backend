# Library Management System

A Node.js/Express-based Library Management System for managing books, genres, and statistics. This project uses TypeScript, MongoDB, and Zod for validation.

## Features

- Add, update, and delete books
- Retrieve all books with filtering, sorting, and pagination
- Get books by genre
- View book statistics (count, total copies, average copies per genre)
- Input validation using Zod
- RESTful API structure

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd assignment-3
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add your MongoDB connection string and other environment variables as needed:
     ```env
     MONGODB_URI=mongodb://localhost:27017/library
     PORT=5000
     ```
4. **Run the application:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## API Endpoints

- `POST   /books`           - Create a new book
- `GET    /books`           - Get all books (with filtering, sorting, pagination)
- `GET    /books/genre/:genre` - Get books by genre
- `GET    /books/stats`     - Get book statistics
- `GET    /books/:bookId`   - Get a single book by ID
- `PUT    /books/:bookId`   - Update a book
- `DELETE /books/:bookId`   - Delete a book

## Technologies Used
- Node.js, Express.js
- TypeScript
- MongoDB, Mongoose
- Zod (validation)

## License

This project is licensed under the MIT License.
