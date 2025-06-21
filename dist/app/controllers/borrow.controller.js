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
exports.getAllBorrows = exports.getOverdueBorrows = exports.returnBook = exports.borrowBook = void 0;
const borrow_model_1 = require("../modelss/borrow.model");
const book_model_1 = require("../modelss/book.model");
// Borrow a book
const borrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrow = yield borrow_model_1.Borrow.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: borrow,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to borrow Book',
            error: error,
        });
    }
});
exports.borrowBook = borrowBook;
// Return a borrowed book
const returnBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const borrow = yield borrow_model_1.Borrow.findById(id);
        if (!borrow) {
            return res.status(404).json({
                success: false,
                message: 'Borrow record not found',
            });
        }
        // Update book copies
        const book = yield book_model_1.Book.findById(borrow.book);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }
        book.copies += borrow.quantity;
        yield book.save();
        // Delete borrow record
        yield borrow_model_1.Borrow.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Book returned successfully',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to return book',
            error: error,
        });
    }
});
exports.returnBook = returnBook;
// Get overdue borrows using aggregation pipeline
const getOverdueBorrows = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date();
        const overdueBorrows = yield borrow_model_1.Borrow.aggregate([
            {
                $match: {
                    dueDate: { $lt: currentDate },
                },
            },
            {
                $lookup: {
                    from: 'books',
                    localField: 'book',
                    foreignField: '_id',
                    as: 'bookDetails',
                },
            },
            {
                $unwind: '$bookDetails',
            },
            {
                $project: {
                    _id: 1,
                    quantity: 1,
                    dueDate: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'bookDetails.title': 1,
                    'bookDetails.author': 1,
                    'bookDetails.isbn': 1,
                    daysOverdue: {
                        $ceil: {
                            $divide: [
                                { $subtract: [currentDate, '$dueDate'] },
                                1000 * 60 * 60 * 24,
                            ],
                        },
                    },
                },
            },
            {
                $sort: { daysOverdue: -1 },
            },
        ]);
        res.status(200).json({
            success: true,
            message: 'Overdue borrows retrieved successfully',
            data: overdueBorrows,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to retrieve overdue borrows',
            error: error,
        });
    }
});
exports.getOverdueBorrows = getOverdueBorrows;
// Get borrowed books summary using aggregation pipeline
const getAllBorrows = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowedBooksSummary = yield borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: '$book',
                    totalQuantity: { $sum: '$quantity' }
                }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookDetails'
                }
            },
            {
                $unwind: '$bookDetails'
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: '$bookDetails.title',
                        isbn: '$bookDetails.isbn'
                    },
                    totalQuantity: 1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: 'Borrowed books summary retrieved successfully',
            data: borrowedBooksSummary,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to retrieve borrowed books summary',
            error: error,
        });
    }
});
exports.getAllBorrows = getAllBorrows;
