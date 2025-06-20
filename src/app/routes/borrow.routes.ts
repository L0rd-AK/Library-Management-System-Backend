import express, { RequestHandler } from 'express';
import {
  borrowBook,
  getAllBorrows,
  returnBook,
  getOverdueBorrows,
} from '../controllers/borrow.controller';

const router = express.Router();

// Cast each handler to RequestHandler
router.post('/', borrowBook as RequestHandler);
router.get('/', getAllBorrows as RequestHandler);
router.get('/overdue', getOverdueBorrows as RequestHandler);
router.delete('/:id', returnBook as RequestHandler);

export default router;