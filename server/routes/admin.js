import express from 'express';
import { protect, isAdmin } from '../middleware/auth.js';
import { getDashboardStats, getAllPendingRequests, getAllCustomers, adjustCustomerBalance } from '../controllers/adminController.js';

const router = express.Router();

// Admin dashboard stats
router.get('/dashboard', protect, isAdmin, getDashboardStats);

// Get all pending requests
router.get('/pending-requests', protect, isAdmin, getAllPendingRequests);

// Customer management
router.get('/customers', protect, isAdmin, getAllCustomers);
router.put('/customers/:userId/balance', protect, isAdmin, adjustCustomerBalance);

export default router;
