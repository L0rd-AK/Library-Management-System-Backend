import { Request, Response } from 'express';
import { Book } from '../modelss/book.model';
import { Genre } from '../interfaces/book.interface';
import { z } from 'zod';

//zod validation
const BookZodvalidation = z.object({
  title: z.string({ invalid_type_error: 'Title must be a string' }).min(1, 'Title is required'),
  author: z.string({ invalid_type_error: 'Author must be a string' }).min(1, 'Author is required'),
  genre: z.nativeEnum(Genre, {
    message: 'Invalid genre',
  }),
  isbn: z.string({ invalid_type_error: 'ISBN must be a string' }).min(1, 'ISBN is required'),
  description: z.string({ invalid_type_error: 'Description must be a string' }).optional(),
  copies: z.number({ invalid_type_error: 'Copies must be a number' }).min(0, 'Copies must be a positive number'),
  available: z.boolean({ invalid_type_error: 'Available must be a boolean' }).optional(),
}); 
// Create a new bookk
export const createBook = async (req: Request, res: Response) => {
  try {
    console.log("hit createBook endpoint");
    const zodbook = await BookZodvalidation.parseAsync(req.body);
    const book = await Book.create(zodbook);
    console.log(book);
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create book',
      error: error,
    });
  }
};

// Get books by genre using static method
export const getBooksByGenre = async (req: Request, res: Response) => {
  try {
    const { genre } = req.params;
    
    if (!Object.values(Genre).includes(genre as Genre)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid genre',
      });
    }
    
    const books = await Book.findByGenre(genre);
    
    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve books',
      error: error,
    });
  }
};

// Get book statistics using aggregation pipeline
export const getBookStats = async (req: Request, res: Response) => {
  try {
    const stats = await Book.aggregate([
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve book statistics',
      error: error,
    });
  }
};

// Get all books with filtering, sorting, and pagination
export const getAllBooks = async (req: Request, res: Response) => {
    try {
      const { filter, sort, sortBy = 'createdAt', limit = 10 } = req.query;
      
      const queryFilter: any = {};
      
      // Filter by genre if provided
      if (filter) {
        queryFilter.genre = filter;
      }
      
      // Create sort object
      const sortOptions: any = {};
      sortOptions[sortBy as string] = sort === 'desc' ? -1 : 1;
      
      const books = await Book.find(queryFilter)
        .sort(sortOptions)
        .limit(Number(limit));
      
      res.status(200).json({
        success: true,
        message: 'Books retrieved successfully',
        data: books,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Failed to retrieve books',
        error: error,
      });
    }
  };

  // Get a single book by ID
export const getBookById = async (req: Request, res: Response) => {
    try {
      const book = await Book.findById(req.params.bookId); 
      
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Failed to retrieve book',
        error: error,
      });
    }
  };
  
  // Update a book
  export const updateBook = async (req: Request, res: Response) => {
    try {
      const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, { // Changed from id to bookId
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Failed to update book',
        error: error,
      });
    }
  };
  
  // Delete a book
  export const deleteBook = async (req: Request, res: Response) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.bookId); // Changed from id to bookId
      
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Failed to delete book',
        error: error,
      });
    }
  };