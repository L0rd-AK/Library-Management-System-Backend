"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const book_routes_1 = __importDefault(require("./app/routes/book.routes"));
const borrow_routes_1 = __importDefault(require("./app/routes/borrow.routes"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.use('/api/books', book_routes_1.default);
app.use('/api/borrow', borrow_routes_1.default); // Changed from '/api/borrows' to '/api/borrow'
app.get('/', (req, res) => {
    res.send('Welcome to Amits Library Management System');
});
// Global error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong',
        success: false,
        error: err
    });
});
exports.default = app;
