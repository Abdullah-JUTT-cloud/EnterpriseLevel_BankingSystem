import express from 'express';
import {
    initiateTransfer,
    verifyOTPAndTransfer,
    getMyTransactions
} from '../controllers/transactionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected (Customer)
router.post('/transfer', protect, initiateTransfer);
router.post('/:id/verify-otp', protect, verifyOTPAndTransfer);
router.get('/my-transactions', protect, getMyTransactions);

export default router;
