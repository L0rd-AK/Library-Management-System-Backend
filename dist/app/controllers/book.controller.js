"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getAllBooks = exports.getBookStats = exports.getBooksByGenre = exports.createBook = void 0;
const book_model_1 = require("../modelss/book.model");
const book_interface_1 = require("../interfaces/book.interface");
// Create a new book
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: book,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create book',
            error: error,
        });
    }
});
exports.createBook = createBook;
// Get books by genre using static method
const getBooksByGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { genre } = req.params;
        if (!Object.values(book_interface_1.Genre).includes(genre)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid genre',
            });
        }
        const books = yield book_model_1.Book.findByGenre(genre);
        res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            data: books,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to retrieve books',
            error: error,
        });
    }
});
exports.getBooksByGenre = getBooksByGenre;
// Get book statistics using aggregation pipeline
const getBookStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield book_model_1.Book.aggregate([
            {
                $group: {
                    _id: '$genre',
                    count: { $sum: 1 },
                    totalCopies: { $sum: '$copies' },
                    averageCopies: { $avg: '$copies' },
                    titles: { $push: '$title' },
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);
        res.status(200).json({
            success: true,
            message: 'Book statistics retrieved successfully',
            data: stats,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to retrieve book statistics',
            error: error,
        });
    }
});
exports.getBookStats = getBookStats;
// Get all books with filtering, sorting, and pagination
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sort, sortBy = 'createdAt', limit = 10 } = req.query;
        const queryFilter = {};
        // Filter by genre if provided
        if (filter) {
            queryFilter.genre = filter;
        }
        // Create sort object
        const sortOptions = {};
        sortOptions[sortBy] = sort === 'desc' ? -1 : 1;
        const books = yield book_model_1.Book.find(queryFilter)
            .sort(sortOptions)
            .limit(Number(limit));
        res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            data: books,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to retrieve books',
            error: error,
        });
    }
});
exports.getAllBooks = getAllBooks;
// Get a single book by ID
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findById(req.params.bookId); // Changed from id to bookId
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Book retrieved successfully',
            data: book,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to retrieve book',
            error: error,
        });
    }
});
exports.getBookById = getBookById;
// Update a book
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findByIdAndUpdate(req.params.bookId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: book,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update book',
            error: error,
        });
    }
});
exports.updateBook = updateBook;
// Delete a book
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findByIdAndDelete(req.params.bookId); // Changed from id to bookId
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
            data: null
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to delete book',
            error: error,
        });
    }
});
exports.deleteBook = deleteBook;
