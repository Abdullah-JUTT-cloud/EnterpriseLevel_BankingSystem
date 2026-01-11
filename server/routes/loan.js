import express from 'express';
import {
    applyLoan,
    getMyLoans,
    getPendingLoans,
    reviewLoan
} from '../controllers/loanController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.post('/apply', protect, applyLoan);
router.get('/my-loans', protect, getMyLoans);

// Admin routes
router.get('/pending', protect, isAdmin, getPendingLoans);
router.put('/:id/review', protect, isAdmin, reviewLoan);

export default router;
