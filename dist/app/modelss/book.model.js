"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const book_interface_1 = require("../interfaces/book.interface");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
    },
    genre: {
        type: String,
        enum: {
            values: Object.values(book_interface_1.Genre),
            message: '{VALUE} is not a valid genre',
        },
        required: [true, 'Genre is required'],
    },
    isbn: {
        type: String,
        required: [true, 'ISBN is required'],
        unique: true,
    },
    description: {
        type: String,
    },
    copies: {
        type: Number,
        required: [true, 'Number of copies is required'],
        min: [0, 'Copies must be a positive number'],
    },
    available: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.__v;
            delete ret.id;
            return ret;
        },
    },
});
// Middleware: Update available status based on copies
bookSchema.pre('save', function (next) {
    if (this.copies <= 0) {
        this.available = false;
    }
    else {
        this.available = true;
    }
    next();
});
// Static method to find books by genre
bookSchema.static('findByGenre', function (genre) {
    return this.find({ genre });
});
exports.Book = (0, mongoose_1.model)('Book', bookSchema);
