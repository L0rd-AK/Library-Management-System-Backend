import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bookRoutes from './app/routes/book.routes';
import borrowRoutes from './app/routes/borrow.routes';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes); // Changed from '/api/borrows' to '/api/borrow'

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Amits Library Management System');
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: any) => {
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong',
        success: false,
        error: err
    });
});

export default app;