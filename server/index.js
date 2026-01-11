import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/auth.js';
import accountRoutes from './routes/account.js';
import kycRoutes from './routes/kyc.js';
import transactionRoutes from './routes/transaction.js';
import creditCardRoutes from './routes/creditCard.js';
import loanRoutes from './routes/loan.js';
import statementRoutes from './routes/statement.js';
import debitCardRoutes from './routes/debitCard.js';
import chequeBookRoutes from './routes/chequeBook.js';
import complaintRoutes from './routes/complaint.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/credit-cards', creditCardRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/statements', statementRoutes);
app.use('/api/debit-cards', debitCardRoutes);
app.use('/api/cheque-books', chequeBookRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({
        message: 'Standard Chartered Bank Pakistan API',
        status: 'Running',
        version: '1.0.0'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}`);
    console.log(`🔐 API Base: http://localhost:${PORT}/api`);
});
