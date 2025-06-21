"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const borrow_controller_1 = require("../controllers/borrow.controller");
const router = express_1.default.Router();
// Cast each handler to RequestHandler
router.post('/', borrow_controller_1.borrowBook);
router.get('/', borrow_controller_1.getAllBorrows);
router.get('/overdue', borrow_controller_1.getOverdueBorrows);
router.delete('/:id', borrow_controller_1.returnBook);
exports.default = router;
