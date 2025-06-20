import mongoose, { Schema, model } from 'mongoose';
import { Genre, IBook } from '../interfaces/book.interface';

interface BookModel extends mongoose.Model<IBook> {
  findByGenre(genre: string): Promise<IBook[]>;
}

const bookSchema = new Schema<IBook, BookModel>(
  {
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
        values: Object.values(Genre),
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

// Middleware: Update available status based on copies
bookSchema.pre('save', function (next) {
  if (this.copies <= 0) {
    this.available = false;
  } else {
    this.available = true;
  }
  next();
});

// Static method to find books by genre
bookSchema.static('findByGenre', function (genre: string) {
  return this.find({ genre });
});

export const Book = model<IBook, BookModel>('Book', bookSchema);