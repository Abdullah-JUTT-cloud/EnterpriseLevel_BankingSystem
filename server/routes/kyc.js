import express from 'express';
import {
    submitKYC,
    getMyKYC,
    getPendingKYC,
    verifyKYC
} from '../controllers/kycController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.post('/', protect, submitKYC);
router.get('/my-kyc', protect, getMyKYC);

// Admin routes
router.get('/pending', protect, isAdmin, getPendingKYC);
router.put('/:id/verify', protect, isAdmin, verifyKYC);

export default router;
