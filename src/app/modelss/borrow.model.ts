import mongoose, { Schema, model } from 'mongoose';
import { IBorrow } from '../interfaces/borrow.interface';
import { Book } from './book.model';

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book ID is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.id;
        return ret;
      },
    },
  }
);

// Middleware: Check if book is available and has enough copies before borrowing
borrowSchema.pre('save', async function (next) {
  try {
    const book = await Book.findById(this.book);
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    if (!book.available) {
      throw new Error('Book is not available for borrowing');
    }
    
    if (book.copies < this.quantity) {
      throw new Error(`Only ${book.copies} copies available`);
    }
    
    // Update book copies
    book.copies -= this.quantity;
    await book.save();
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Borrow = model<IBorrow>('Borrow', borrowSchema);