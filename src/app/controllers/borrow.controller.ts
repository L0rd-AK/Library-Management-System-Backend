import { Request, Response } from 'express';
import { Borrow } from '../modelss/borrow.model';
import { Book } from '../modelss/book.model';

// Borrow a book
export const borrowBook = async (req: Request, res: Response) => {
  try {
    const borrow = await Borrow.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: borrow,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to borrow Book',
      error: error,
    });
  }
};

// Return a borrowed book
export const returnBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const borrow = await Borrow.findById(id);
    
    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found',
      });
    }
    
    // Update book copies
    const book = await Book.findById(borrow.book);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }
    
    book.copies += borrow.quantity;
    await book.save();
    
    // Delete borrow record
    await Borrow.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to return book',
      error: error,
    });
  }
};

// Get overdue borrows using aggregation pipeline
export const getOverdueBorrows = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    
    const overdueBorrows = await Borrow.aggregate([
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve overdue borrows',
      error: error,
    });
  }
};

// Get borrowed books summary using aggregation pipeline
export const getAllBorrows = async (req: Request, res: Response) => {
    try {
      const borrowedBooksSummary = await Borrow.aggregate([
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Failed to retrieve borrowed books summary',
        error: error,
      });
    }
  };