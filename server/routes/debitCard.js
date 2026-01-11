import express from 'express';
import {
    requestDebitCard,
    getMyDebitCardRequests
} from '../controllers/debitCardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected (Customer)
router.post('/request', protect, requestDebitCard);
router.get('/my-requests', protect, getMyDebitCardRequests);

export default router;
