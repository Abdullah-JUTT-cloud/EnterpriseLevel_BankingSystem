import express from 'express';
import {
    applyCreditCard,
    getMyCreditCards,
    getPendingApplications,
    reviewApplication
} from '../controllers/creditCardController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.post('/apply', protect, applyCreditCard);
router.get('/my-applications', protect, getMyCreditCards);

// Admin routes
router.get('/pending', protect, isAdmin, getPendingApplications);
router.put('/:id/review', protect, isAdmin, reviewApplication);

export default router;
