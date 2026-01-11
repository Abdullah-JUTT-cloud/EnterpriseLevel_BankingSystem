import express from 'express';
import {
    requestStatement,
    getMyStatements
} from '../controllers/statementController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected (Customer)
router.post('/request', protect, requestStatement);
router.get('/my-requests', protect, getMyStatements);

export default router;
