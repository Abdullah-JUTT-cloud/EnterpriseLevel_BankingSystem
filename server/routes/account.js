import express from 'express';
import {
    createAccount,
    getMyAccount,
    getAccountByNumber
} from '../controllers/accountController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.post('/', protect, createAccount);
router.get('/my-account', protect, getMyAccount);
router.get('/:accountNumber', protect, getAccountByNumber);

export default router;
