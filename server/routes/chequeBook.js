import express from 'express';
import {
    requestChequeBook,
    getMyChequeBookRequests
} from '../controllers/chequeBookController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected (Customer)
router.post('/request', protect, requestChequeBook);
router.get('/my-requests', protect, getMyChequeBookRequests);

export default router;
