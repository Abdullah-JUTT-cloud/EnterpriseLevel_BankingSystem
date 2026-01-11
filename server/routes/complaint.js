import express from 'express';
import {
    submitComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaint
} from '../controllers/complaintController.js';
import { protect, isStaff } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.post('/', protect, submitComplaint);
router.get('/my-complaints', protect, getMyComplaints);

// Admin/Staff routes
router.get('/all', protect, isStaff, getAllComplaints);
router.put('/:id', protect, isStaff, updateComplaint);

export default router;
