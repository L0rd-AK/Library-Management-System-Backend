import express, { RequestHandler } from 'express';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBooksByGenre,
  getBookStats,
} from '../controllers/book.controller';

const router = express.Router();

// Cast each handler to RequestHandler to satisfy TypeScript
router.post('/', createBook as RequestHandler);
router.get('/', getAllBooks as RequestHandler);
router.get('/stats', getBookStats as RequestHandler);
router.get('/genre/:genre', getBooksByGenre as RequestHandler);
router.get('/:bookId', getBookById as RequestHandler); 
router.put('/:bookId', updateBook as RequestHandler); 
router.delete('/:bookId', deleteBook as RequestHandler); 

export default router;